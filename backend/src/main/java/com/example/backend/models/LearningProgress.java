LearningProgress progress = new LearningProgress();
progress.setUserId("user123");
progress.setSkillType("coding");
progress.setTitle("Advanced Java Programming");
progress.setDescription("Complete the Java programming course with advanced concepts.");
progress.setStatus("in_progress");

List<String> completed = Arrays.asList("Introduction to Java", "Basic Syntax");
progress.setCompletedMilestones(completed);

List<String> current = Arrays.asList("Object-Oriented Programming");
progress.setCurrentMilestones(current);

List<String> upcoming = Arrays.asList("Exception Handling", "Collections");
progress.setUpcomingMilestones(upcoming);

progress.setProgressPercentage(50);
progress.setTags(Arrays.asList("Java", "Programming", "Advanced"));
progress.setPublic(true);

System.out.println("Learning Progress for: " + progress.getTitle());
System.out.println("Current Milestone: " + progress.getCurrentMilestones().get(0));
System.out.println("Progress: " + progress.getProgressPercentage() + "%");
