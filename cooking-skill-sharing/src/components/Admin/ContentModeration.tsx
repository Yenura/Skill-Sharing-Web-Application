import { useState, useEffect } from 'react';
import { AlertTriangle, Check, X, Ban, AlertCircle, BarChart, Users, Star, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'user';
  reporterId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  content: {
    preview: string;
    author: string;
  };
  actionHistory?: ModAction[];
  userHistory?: {
    previousReports: number;
    accountAge: string;
    recentWarnings: number;
  };
}

interface ModAction {
  id: string;
  reportId: string;
  action: 'approve' | 'remove' | 'warn' | 'ban';
  moderatorId: string;
  timestamp: Date;
  note?: string;
  severity: 'low' | 'medium' | 'high';
  affectedContent?: string[];
}

interface Analytics {
  totalReports: number;
  resolvedReports: number;
  averageResponseTime: string;
  topReportReasons: { reason: string; count: number }[];
}

interface ContentStats {
  flaggedContent: number;
  removedContent: number;
  warningsSent: number;
  activeUserBans: number;
}

export default function ContentModeration() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [auditLog, setAuditLog] = useState<ModAction[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [severityLevel, setSeverityLevel] = useState<ModAction['severity']>('low');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [activeSection, setActiveSection] = useState<'reports' | 'analytics' | 'featured'>('reports');

  useEffect(() => {
    fetchReports();
    fetchAnalytics();
    fetchContentStats();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/moderation/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const fetchContentStats = async () => {
    try {
      const response = await fetch('/api/admin/moderation/stats');
      if (!response.ok) throw new Error('Failed to fetch content stats');
      const data = await response.json();
      setContentStats(data);
    } catch (err) {
      console.error('Failed to load content stats:', err);
    }
  };

  const handleModAction = async (reportId: string, action: ModAction['action'], note?: string) => {
    try {
      const actionData: ModAction = {
        id: crypto.randomUUID(), // Generate a unique ID for the action
        reportId,
        action,
        note,
        severity: severityLevel,
        timestamp: new Date(),
        moderatorId: 'current-mod-id' // Replace with actual moderator ID
      };

      const response = await fetch('/api/admin/moderation/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      });
      
      if (!response.ok) throw new Error('Failed to perform action');
      
      // Update audit log
      setAuditLog(prev => [actionData, ...prev]);
      await fetchReports();
      
      // Show success toast
      toast({
        title: "Action completed",
        description: `Successfully ${action}ed the content`,
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500" />
    </div>;
  }

  const ReportDetailsModal = ({ report, onClose }: { report: Report; onClose: () => void }) => (
    <div 
      role="dialog"
      aria-labelledby="report-details-title"
      aria-describedby="report-details-content"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="ml-3 text-lg font-medium text-gray-900" id="report-details-title">
              Report Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6 space-y-4" id="report-details-content">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Content Preview</h4>
            <div className="mt-1 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
              {report.content.preview}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Report Reason</h4>
              <p className="text-sm text-gray-800">{report.reason}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Reported By</h4>
              <p className="text-sm text-gray-800">{report.reporterId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Report Date</h4>
              <p className="text-sm text-gray-800">{new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="text-sm text-gray-800">{report.status}</p>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <h4 className="text-lg font-semibold">User History</h4>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">Previous Reports</p>
                <p className="text-lg font-semibold">{report.userHistory?.previousReports || 0}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">Account Age</p>
                <p className="text-lg font-semibold">{report.userHistory?.accountAge || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">Recent Warnings</p>
                <p className="text-lg font-semibold">{report.userHistory?.recentWarnings || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Action History</h4>
            <div className="mt-2 max-h-40 overflow-y-auto">
              {report.actionHistory?.map((action, index) => (
                <div key={index} className="mb-2 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{action.action}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(action.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {action.note && <p className="mt-1 text-sm text-gray-600">{action.note}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <select
              value={severityLevel}
              onChange={(e) => setSeverityLevel(e.target.value as ModAction['severity'])}
              className="rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="low">Low Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="high">High Severity</option>
            </select>
            
            <button
              onClick={() => handleModAction(report.id, 'warn')}
              className="rounded-md bg-yellow-600 px-4 py-2 text-white"
            >
              Warn User
            </button>
            <button
              onClick={() => handleModAction(report.id, 'ban')}
              className="rounded-md bg-red-600 px-4 py-2 text-white"
            >
              Ban User
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-medium text-gray-500">Total Reports</h4>
        <p className="mt-2 text-3xl font-bold">{analytics?.totalReports}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-medium text-gray-500">Resolved Reports</h4>
        <p className="mt-2 text-3xl font-bold">{analytics?.resolvedReports}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-medium text-gray-500">Average Response Time</h4>
        <p className="mt-2 text-3xl font-bold">{analytics?.averageResponseTime}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-medium text-gray-500">Active Bans</h4>
        <p className="mt-2 text-3xl font-bold">{contentStats?.activeUserBans}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveSection('reports')}
          className={`${activeSection === 'reports' ? 'border-b-2 border-orange-500' : ''} px-4 py-2`}
        >
          Reports Queue
        </button>
        <button
          onClick={() => setActiveSection('analytics')}
          className={`${activeSection === 'analytics' ? 'border-b-2 border-orange-500' : ''} px-4 py-2`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveSection('featured')}
          className={`${activeSection === 'featured' ? 'border-b-2 border-orange-500' : ''} px-4 py-2`}
        >
          Featured Content
        </button>
      </div>

      {activeSection === 'analytics' && renderAnalytics()}
      {activeSection === 'reports' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Pending Reports</h3>
            <div className="space-y-2">
              {reports.map(report => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="w-full rounded-md border p-3 text-left hover:bg-gray-50"
                  aria-label={`View report for ${report.content.preview}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{report.reason}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {report.content.preview}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Recent Actions</h3>
            <div className="space-y-2">
              {auditLog.slice(0, 5).map((action, index) => (
                <div key={index} className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{action.action}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(action.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeSection === 'featured' && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Featured Content Selection</h3>
          {/* Add featured content implementation */}
        </div>
      )}
    </div>
  );
}
