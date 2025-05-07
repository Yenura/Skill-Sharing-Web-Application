package com.skillsharing.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillsharing.dto.LearningPlanDTO;
import com.skillsharing.model.LearningPlan;
import com.skillsharing.model.Resource;
import com.skillsharing.model.Week;
import com.skillsharing.repository.LearningPlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public LearningPlan createLearningPlan(LearningPlanDTO learningPlanDTO) {
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setTitle(learningPlanDTO.getTitle());
        learningPlan.setDescription(learningPlanDTO.getDescription());

        learningPlan.setAge(learningPlanDTO.getAge());
        learningPlan.setGender(learningPlanDTO.getGender());
        learningPlan.setHeight(learningPlanDTO.getHeight());
        learningPlan.setWeight(learningPlanDTO.getWeight());

        learningPlan.setResources(
            learningPlanDTO.getResources().stream()
                .map(resourceDTO -> {
                    Resource resource = new Resource();
                    resource.setTitle(resourceDTO.getTitle());
                    resource.setUrl(resourceDTO.getUrl());
                    return resource;
                })
                .toList()
        );
        learningPlan.setWeeks(
            learningPlanDTO.getWeeks().stream()
                .map(weekDTO -> {
                    Week week = new Week();
                    week.setTitle(weekDTO.getTitle());
                    week.setDescription(weekDTO.getDescription());

                    return week;
                })
                .toList()
        );
        return learningPlanRepository.save(learningPlan);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlanDTO learningPlanDTO) {
        return learningPlanRepository.findById(id)
                .map(existingPlan -> {
                    existingPlan.setResources(
                        learningPlanDTO.getResources().stream()
                            .map(resourceDTO -> {
                                Resource resource = new Resource();
                                resource.setTitle(resourceDTO.getTitle());
                                resource.setUrl(resourceDTO.getUrl());
                                return resource;
                            })
                            .toList()
                    );
                    existingPlan.setDescription(learningPlanDTO.getDescription());
                    existingPlan.setResources(
                        learningPlanDTO.getResources().stream()
                            .map(resourceDTO -> {
                                Resource resource = new Resource();
                                resource.setTitle(resourceDTO.getTitle());
                                resource.setUrl(resourceDTO.getUrl());
                                return resource;
                            })
                            .toList()
                    );
                    existingPlan.setWeeks(
                        learningPlanDTO.getWeeks().stream()
                            .map(weekDTO -> {
                                Week week = new Week();
                                week.setTitle(weekDTO.getTitle());
                                week.setDescription(weekDTO.getDescription());

                                return week;
                            })
                            .toList()
                    );
                    return learningPlanRepository.save(existingPlan);
                })
                .orElseThrow(() -> new RuntimeException("LearningPlan not found with id: " + id));
    }

    public void deleteLearningPlan(String id) {
        learningPlanRepository.deleteById(id);
    }
}