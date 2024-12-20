import { Box, IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";

function DropzoneComponent({
  files,
  setFiles,
  dropzoneLabel,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
  dropzoneLabel?: string;
}) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFiles([...files, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Stack direction={"column"} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", marginY: "0.3rem" }}>
        {files && files?.length > 0 && (
          <>
            {files?.map((file, index) => (
              <Box
                key={index}
                sx={{
                  color: grey[600],
                  display: "inline-block",
                  backgroundColor: "#fff",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "2rem",
                  border: `1px solid ${grey[500]}`,
                  marginX: "0.3rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <Typography key={index} variant="caption">
                    {file.name}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setFiles(files.filter((f) => f !== file));
                    }}
                    size="small"
                    style={{ margin: "0 0 0 5px", padding: 0 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Box>
      <Box
        {...getRootProps({ className: "dropzone" })}
        sx={{
          border: `1px dashed ${grey[700]}`,
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: grey[50],
          width: "100%",
          height: "100%",
          borderRadius: "4px",
        }}
      >
        <input {...getInputProps()} draggable />
        <Typography
          variant="body2"
          sx={{ color: grey[600], marginY: "0.3rem" }}
        >
          {dropzoneLabel
            ? `${dropzoneLabel}`
            : isDragActive
            ? "Drop the files here ..."
            : "Drag 'n' drop some files here, or click to select files"}
        </Typography>
      </Box>
    </Stack>
  );
}

export default DropzoneComponent;
