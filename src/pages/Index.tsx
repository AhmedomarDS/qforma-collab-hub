
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-qforma-teal text-white rounded-lg h-12 w-12 flex items-center justify-center font-bold text-2xl">Q</div>
            <h1 className="text-3xl font-bold ml-2 flex items-center text-qforma-blue">QForma</h1>
          </div>
          <CardTitle className="text-2xl">Welcome to QForma</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            A comprehensive platform for QA teams to manage requirements,
            test cases, and team communication.
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-qforma-blue hover:bg-qforma-blue/90"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
