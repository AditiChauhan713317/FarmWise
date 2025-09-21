export interface PestAnalysisResponse {
  prediction: string;
}

interface PestFile {
  uri: string;
  type: string;
  name: string;
}

export const analyzePest = async (
  file: PestFile
): Promise<PestAnalysisResponse> => {
  const formData = new FormData();
  formData.append("image", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);

  const response = await fetch(
    "https://sih-pest-analysis-2025-microservice.onrender.com/predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data: PestAnalysisResponse = await response.json();
  return data;
};
