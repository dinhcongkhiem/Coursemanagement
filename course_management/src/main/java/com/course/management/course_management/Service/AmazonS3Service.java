package com.course.management.course_management.Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AmazonS3Service {
    @Value("${aws.bucketName}")
    private String bucketName;
    private final AmazonS3 amazonS3;
    public String uploadFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        try {
            File fileObj = convertMultiPartFileToFile(file);
            amazonS3.putObject(new PutObjectRequest(bucketName, fileName, fileObj).withCannedAcl(CannedAccessControlList.PublicRead));
            fileObj.delete();
            return amazonS3.getUrl(bucketName, fileName).toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tải tệp lên S3", e);
        }
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi chuyển đổi MultipartFile thành File", e);
        }
        return convertedFile;
    }
}
