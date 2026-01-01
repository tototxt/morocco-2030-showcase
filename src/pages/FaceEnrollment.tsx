import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, ScanFace } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FaceCapture } from "@/components/face/FaceCapture";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useFaceAPI } from "@/hooks/useFaceAPI";
import { toast } from "sonner";

const FaceEnrollment = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const { enrollFace, isLoading: apiLoading } = useFaceAPI();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/tickets/face-enrollment" } });
      return;
    }

    // Check if cart exists
    const savedCart = sessionStorage.getItem("ticketCart");
    if (!savedCart) {
      toast.error("No tickets selected");
      navigate("/tickets");
    }
  }, [user, authLoading, navigate]);

  const handleCapture = (imageBase64: string) => {
    console.log("Face captured for enrollment");
  };

  const handleConfirm = async () => {
    if (!capturedImage || !user) return;

    // Get cart data to get a purchase reference
    const savedCart = sessionStorage.getItem("ticketCart");
    if (!savedCart) {
      toast.error("Cart data not found");
      return;
    }

    const cartData = JSON.parse(savedCart);
    const purchaseRef = `pending_${cartData.match.id}_${Date.now()}`;

    const result = await enrollFace(user.id, purchaseRef, capturedImage);

    if (result.success) {
      // Store enrollment info in session for later use
      sessionStorage.setItem("faceEnrollmentComplete", "true");
      sessionStorage.setItem("faceEnrollmentId", result.enrollmentId || "");
      
      setIsEnrolled(true);
      toast.success("Face enrolled successfully!");
      
      // Navigate to payment after short delay
      setTimeout(() => {
        navigate("/tickets/payment");
      }, 1500);
    } else {
      toast.error(result.error || "Face enrollment failed");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-morocco">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Review
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
              Face Enrollment
            </h1>
            <p className="opacity-90">
              Register your face for secure stadium entry
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 shadow-lg mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold mb-2">Secure Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Your face data is encrypted and used only for stadium entry verification. 
                    This ensures your ticket cannot be used by anyone else.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Face Capture Component */}
            {isEnrolled ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <ScanFace className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Face Enrolled Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Redirecting to payment...
                </p>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-lg"
              >
                <FaceCapture
                  onCapture={handleCapture}
                  onConfirm={handleConfirm}
                  onRetake={handleRetake}
                  isProcessing={apiLoading}
                  capturedImage={capturedImage}
                  setCapturedImage={setCapturedImage}
                />
              </motion.div>
            )}

            {/* Steps Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex justify-center gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-sm text-muted-foreground">Review</span>
              </div>
              <div className="w-8 h-px bg-border self-center" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm font-medium">Face Enrollment</span>
              </div>
              <div className="w-8 h-px bg-border self-center" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm text-muted-foreground">Payment</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FaceEnrollment;
