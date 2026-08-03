import Konva from "konva";

let currentStage: Konva.Stage | null = null;

export function registerCanvasStage(
  stage: Konva.Stage | null
) {
  currentStage = stage;
}

export function generateCanvasThumbnail(): string {
  if (!currentStage) {
    throw new Error(
      "Canvas stage is not initialized."
    );
  }

  return currentStage.toDataURL({
    pixelRatio: 1,
    mimeType: "image/png",
  });
}

export function exportCanvasAsPNG() {
  if (!currentStage) {
    console.error(
      "Canvas stage is not initialized."
    );
    return;
  }

  const dataURL = currentStage.toDataURL({
    pixelRatio: 2,
    mimeType: "image/png",
  });

  const link = document.createElement("a");

  link.download = `landscape-design-${Date.now()}.png`;
  link.href = dataURL;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}