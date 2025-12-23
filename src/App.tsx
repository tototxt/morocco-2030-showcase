import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/hooks/useSupabaseAuth";
import Index from "./pages/Index";
import Cities from "./pages/Cities";
import Stadiums from "./pages/Stadiums";
import StadiumDetail from "./pages/StadiumDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import TicketStore from "./pages/TicketStore";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupabaseAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/stadiums" element={<Stadiums />} />
            <Route path="/stadium/:slug" element={<StadiumDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/tickets" element={<TicketStore />} />
            <Route path="/tickets/select/:matchId" element={<SeatSelection />} />
            <Route path="/tickets/checkout" element={<Checkout />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SupabaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
