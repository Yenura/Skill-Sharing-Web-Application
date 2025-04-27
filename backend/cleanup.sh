#!/bin/bash

# Bash script to cleanup and consolidate the project structure

echo -e "\e[32mStarting project structure cleanup...\e[0m"

# 1. Fix SearchService duplicate
echo -e "\e[33mFixing duplicate SearchService...\e[0m"
if [ -f "src/main/java/com/example/pafbackend/service/SearchService.java" ]; then
    rm "src/main/java/com/example/pafbackend/service/SearchService.java"
    echo -e "\e[32mRemoved duplicate SearchService from service directory\e[0m"
fi

# 2. Consolidate directories
consolidate_directory() {
    source=$1
    target=$2
    
    echo -e "\e[33mConsolidating $source into $target...\e[0m"
    
    if [ -d "$source" ]; then
        # Move files from source to target
        for file in "$source"/*; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                
                if [ -f "$target/$filename" ]; then
                    echo -e "\e[33mWarning: File $filename already exists in target. Skipping...\e[0m"
                else
                    mv "$file" "$target/"
                    echo -e "\e[32mMoved $filename to $target\e[0m"
                fi
            fi
        done
        
        # Remove empty source directory
        if [ -z "$(ls -A "$source")" ]; then
            rmdir "$source"
            echo -e "\e[32mRemoved empty directory $source\e[0m"
        else
            echo -e "\e[33mDirectory $source still contains items and was not removed\e[0m"
        fi
    else
        echo -e "\e[33mSource directory $source not found. Skipping...\e[0m"
    fi
}

consolidate_directory "src/main/java/com/example/pafbackend/service" "src/main/java/com/example/pafbackend/services"
consolidate_directory "src/main/java/com/example/pafbackend/repository" "src/main/java/com/example/pafbackend/repositories"
consolidate_directory "src/main/java/com/example/pafbackend/controller" "src/main/java/com/example/pafbackend/controllers"
consolidate_directory "src/main/java/com/example/pafbackend/model" "src/main/java/com/example/pafbackend/models"

# 3. Fix application.properties conflicts
echo -e "\e[33mFixing application properties conflicts...\e[0m"
if [ -f "src/main/resources/application.properties" ]; then
    mv "src/main/resources/application.properties" "src/main/resources/application.properties.backup"
    echo -e "\e[32mRenamed application.properties to application.properties.backup\e[0m"
fi

echo -e "\e[32mProject structure cleanup complete!\e[0m" 