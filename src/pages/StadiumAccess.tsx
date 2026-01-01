import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanFace, CheckCircle2, XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FaceCapture } from "@/components/face/FaceCapture";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useFaceAPI } from "@/hooks/useFaceAPI";

type VerificationState = "idle" | "scanning" | "granted" | "denied";

const StadiumAccess = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const { verifyFace, isLoading: apiLoading } = useFaceAPI();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/stadium-access" } });
    }
  }, [user, authLoading, navigate]);

  const handleCapture = (imageBase64: string) => {
    console.log("Face captured for verification");
  };

  const handleConfirm = async () => {
    if (!capturedImage || !user) return;

    setVerificationState("scanning");
    setVerificationMessage("Verifying your identity...");

    const result = await verifyFace(user.id, capturedImage);

    if (result.success && result.verified) {
      setVerificationState("granted");
      setVerificationMessage("Identity verified! Access granted.");
    } else {
      setVerificationState("denied");
      setVerificationMessage(result.error || "Verification failed. Access denied.");
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setVerificationState("idle");
    setVerificationMessage("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const renderVerificationResult = () => {
    if (verificationState === "scanning") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-12 shadow-lg text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
          />
          <h3 className="font-display text-xl font-bold mb-2">Scanning...</h3>
          <p className="text-muted-foreground">{verificationMessage}</p>
        </motion.div>
      );
    }

    if (verificationState === "granted") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary/10 border-2 border-secondary rounded-2xl p-12 shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <CheckCircle2 className="w-24 h-24 text-secondary mx-auto mb-6" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-secondary mb-2">
            ACCESS GRANTED
          </h2>
          <p className="text-muted-foreground mb-6">{verificationMessage}</p>
          <p className="text-lg font-medium">
            Welcome, {user?.email?.split("@")[0]}!
          </p>
          <Button
            variant="outline"
            onClick={handleRetry}
            className="mt-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Verify Another
          </Button>
        </motion.div>
      );
    }

    if (verificationState === "denied") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/10 border-2 border-destructive rounded-2xl p-12 shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <XCircle className="w-24 h-24 text-destructive mx-auto mb-6" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-destructive mb-2">
            ACCESS DENIED
          </h2>
          <p className="text-muted-foreground mb-6">{verificationMessage}</p>
          <Button
            onClick={handleRetry}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-morocco">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <ScanFace className="w-8 h-8" />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Stadium Access
            </h1>
            <p className="opacity-90">
              Face verification for stadium entry
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {verificationState === "idle" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="font-display text-lg font-bold mb-2">
                    Verify Your Identity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Look at the camera to verify your face for stadium entry
                  </p>
                </div>
                <FaceCapture
                  onCapture={handleCapture}
                  onConfirm={handleConfirm}
                  onRetake={() => setCapturedImage(null)}
                  isProcessing={apiLoading}
                  capturedImage={capturedImage}
                  setCapturedImage={setCapturedImage}
                />
              </motion.div>
            ) : (
              renderVerificationResult()
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StadiumAccess;
