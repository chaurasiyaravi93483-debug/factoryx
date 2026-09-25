package com.factoryx.factoryx_backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;

@Service
public class DocumentTextExtractor {

    // =====================================================
    // EXTRACT PDF TEXT
    // =====================================================

    public String extractText(Path pdfPath) throws IOException {

        if (pdfPath == null) {
            throw new IllegalArgumentException(
                    "PDF path cannot be null."
            );
        }

        if (!pdfPath.toFile().exists()) {
            throw new IOException(
                    "PDF file not found: " + pdfPath
            );
        }


        try (PDDocument document =
                     Loader.loadPDF(pdfPath.toFile())) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text =
                    stripper.getText(document);


            if (text == null) {
                return "";
            }


            return text.trim();
        }
    }
}