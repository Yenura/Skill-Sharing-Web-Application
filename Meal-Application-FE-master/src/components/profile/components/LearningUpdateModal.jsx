import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LearningUpdateModal = ({ isOpen, onClose, onSubmit, templates, isEditMode = false, updateToEdit = null }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(1); // Step 1: Select template, Step 2: Fill form

  // Handle initialization based on edit mode
  useEffect(() => {
    if (isEditMode && updateToEdit) {
      // Find the matching template
      const matchingTemplate = templates.find(template => template.category === updateToEdit.category);
      
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate);
        // Pre-fill the form with existing data
        setFormData({
          ...updateToEdit,
          // Ensure any nested properties are properly copied
          skillsLearned: [...(updateToEdit.skillsLearned || [])]
        });
        setStep(2); // Skip to the form step
      }
    }
  }, [isEditMode, updateToEdit, templates]);

  const resetForm = () => {
    setSelectedTemplate(null);
    setFormData({});
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({ 
      title: template.title,
      category: template.category,
    });
    setStep(2);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (value) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    setFormData(prev => ({
      ...prev,
      skillsLearned: skills
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If in edit mode, preserve the original ID
    const submissionData = isEditMode && updateToEdit 
      ? { ...formData, id: updateToEdit.id }
      : formData;
      
    onSubmit(submissionData);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold">
            {isEditMode ? 'Edit Planing Update' : (step === 1 ? 'Select Update Type' : 'Add Planing Update')}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Select the type of meal update you want to add:</p>
              
              {templates && templates.map((template, index) => (
                <div 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-DarkColor hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-DarkColor text-white flex items-center justify-center">
                      <i className={`fa ${
                        template.category === 'TUTORIAL' ? 'fa-utensils' : 
                        template.category === 'COURSE' ? 'fa-lemon' :
                        'fa-clipboard-list'
                      } text-xl`}></i>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{template.title}</h4>
                      <p className="text-sm text-gray-500">
                        {template.category === 'TUTORIAL' ? 'Track any meal you have eaten — breakfast, lunch, dinner, or snacks' : 
                         template.category === 'COURSE' ? 'Share a new dish you cooked or discovered' :
                         'Show your meal prep for the day or week!'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedTemplate && selectedTemplate.fields.map((field, index) => (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                      rows={4}
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, parseInt(e.target.value))}
                      required={field.required}
                      min={0}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'tags' && (
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-DarkColor"
                        value={formData.skillsLearned ? formData.skillsLearned.join(', ') : ''}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        placeholder="Separate words with commas"
                        required={field.required}
                      />
                       <p className="text-xs text-gray-500 mt-1">Example: High protein, Vegetarian, Budget-friendly, Low sugar, Quick prep</p>
                    </div>
                    
                  )}
                </div>
              ))}
              
              <div className="flex justify-end space-x-3 pt-4">
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor"
                >
                  {isEditMode ? 'Update' : 'Add Planing Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningUpdateModal;
