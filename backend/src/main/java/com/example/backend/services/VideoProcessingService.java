package com.example.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class VideoProcessingService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.ffmpeg.path}")
    private String ffmpegPath;

    @Value("${app.ffprobe.path}")
    private String ffprobePath;

    private static final int MAX_VIDEO_DURATION = 30; // seconds
    private static final int THUMBNAIL_WIDTH = 320;
    private static final int THUMBNAIL_HEIGHT = 180;

    public String processVideo(MultipartFile file) throws IOException {
        // Validate video duration
        if (!validateVideoDuration(file)) {
            throw new IllegalArgumentException("Video duration exceeds 30 seconds limit");
        }

        // Generate unique filename
        String filename = UUID.randomUUID().toString();
        String videoPath = uploadDir + "/videos/" + filename + ".mp4";
        String thumbnailPath = uploadDir + "/thumbnails/" + filename + ".jpg";

        // Save video file
        Path videoFilePath = Paths.get(videoPath);
        Files.createDirectories(videoFilePath.getParent());
        Files.copy(file.getInputStream(), videoFilePath);

        // Generate thumbnail
        generateThumbnail(videoPath, thumbnailPath);

        // Optimize video
        String optimizedVideoPath = optimizeVideo(videoPath);

        return optimizedVideoPath;
    }

    private boolean validateVideoDuration(MultipartFile file) throws IOException {
        FFprobe ffprobe = new FFprobe(ffprobePath);
        Path tempFile = Files.createTempFile("temp", file.getOriginalFilename());
        Files.copy(file.getInputStream(), tempFile);

        FFmpegProbeResult probeResult = ffprobe.probe(tempFile.toString());
        double duration = probeResult.getFormat().duration;

        Files.delete(tempFile);
        return duration <= MAX_VIDEO_DURATION;
    }

    private void generateThumbnail(String videoPath, String thumbnailPath) throws IOException {
        FFmpeg ffmpeg = new FFmpeg(ffmpegPath);
        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, new FFprobe(ffprobePath));

        FFmpegBuilder builder = new FFmpegBuilder()
            .setInput(videoPath)
            .addOutput(thumbnailPath)
            .setFrames(1)
            .setVideoFilter(String.format("scale=%d:%d", THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT))
            .done();

        executor.createJob(builder).run();
    }

    private String optimizeVideo(String videoPath) throws IOException {
        String optimizedPath = videoPath.replace(".mp4", "_optimized.mp4");
        
        FFmpeg ffmpeg = new FFmpeg(ffmpegPath);
        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, new FFprobe(ffprobePath));

        FFmpegBuilder builder = new FFmpegBuilder()
            .setInput(videoPath)
            .addOutput(optimizedPath)
            .setVideoCodec("libx264")
            .setConstantRateFactor(28)
            .setAudioCodec("aac")
            .setAudioBitRate(128000)
            .setVideoFilter("scale=1280:-1")
            .done();

        executor.createJob(builder).run();

        // Delete original file
        Files.delete(Paths.get(videoPath));

        return optimizedPath;
    }
} 