package smart_e_waste.smartEwaste.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String root;

    public String save(MultipartFile f, String folder) throws Exception {

        File dir=new File(root + "/" + folder);
        if (!dir.exists()) dir.mkdirs();
        String fileName=System.currentTimeMillis() + "_" + f.getOriginalFilename();
        File dest=new File(dir.getAbsolutePath() + "/" + fileName);

        f.transferTo(dest);

        return fileName;
    }
}
