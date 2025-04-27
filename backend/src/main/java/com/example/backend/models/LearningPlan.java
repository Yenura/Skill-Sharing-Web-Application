LearningPlan learningPlan = new LearningPlan();
learningPlan.setTitle("Advanced Data Science");
learningPlan.setDescription("This plan covers deep learning, machine learning, and big data analytics.");
learningPlan.setSkillType("Data Science");
learningPlan.setStartDate(LocalDateTime.now());
learningPlan.setTargetEndDate(LocalDateTime.now().plusMonths(3));

// Assuming LearningModule objects are already created.
List<LearningModule> modules = Arrays.asList(new LearningModule(), new LearningModule());
learningPlan.setModules(modules);

learningPlan.setTags(Arrays.asList("Data Science", "Deep Learning", "Machine Learning"));
learningPlan.setTotalModules(modules.size());
learningPlan.setStatus("active");

learningPlan.setPublic(true);
learningPlan.setPrerequisites(Arrays.asList("Basic Python", "Statistics"));
learningPlan.setLearningOutcomes(Arrays.asList("Master deep learning", "Understand big data technologies"));

System.out.println("Learning Plan: " + learningPlan.getTitle());
