type CropRecommendationResponse = {
  recommendation: string;
};

type CropRecommendationRequest = {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
};


function getCropRecommendation() {
  async function fetchRecommendation(inputs: CropRecommendationRequest): Promise<string | null> {
    try {
      const response = await fetch("https://sih-crop-recommendation-2025-microservice.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CropRecommendationResponse = await response.json();
      return data.recommendation;
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      return null;
    }
  }

  return {
    fetchRecommendation
  };
}

export default getCropRecommendation;
