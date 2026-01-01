import { useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFaceCapture } from "@/hooks/useFaceCapture";

interface FaceCaptureProps {
  onCapture: (imageBase64: string) => void;
  onConfirm: () => void;
  onRetake: () => void;
  isProcessing?: boolean;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
}

export const FaceCapture = ({
  onCapture,
  onConfirm,
  onRetake,
  isProcessing = false,
  capturedImage,
  setCapturedImage,
}: FaceCaptureProps) => {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    captureImage,
    resetCapture,
  } = useFaceCapture();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const image = captureImage();
    if (image) {
      setCapturedImage(image);
      onCapture(image);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    resetCapture();
    onRetake();
    startCamera();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive text-center">{error}</p>
        <Button onClick={startCamera} variant="outline" className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Camera View or Captured Image */}
      <div className="relative w-full max-w-md aspect-[4/3] bg-muted rounded-2xl overflow-hidden mb-6">
        {capturedImage ? (
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={capturedImage}
            alt="Captured face"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-60 border-4 border-dashed border-primary/50 rounded-full" />
            </div>
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Instructions */}
      <p className="text-muted-foreground text-center mb-6 text-sm">
        {capturedImage
          ? "Review your photo and confirm to proceed"
          : "Position your face within the oval and click capture"}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {capturedImage ? (
          <>
            <Button
              variant="outline"
              onClick={handleRetake}
              disabled={isProcessing}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? "Processing..." : "Confirm & Continue"}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleCapture}
            disabled={!isStreaming}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Camera className="w-5 h-5 mr-2" />
            Capture Photo
          </Button>
        )}
      </div>
    </div>
  );
};
