import Navbar from "@/components/Navbar";
import TeacherActivationForm from "@/components/TeacherActivationForm";

export default function TeacherActivatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: "مامۆستا", role: "teacher" }} />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <TeacherActivationForm />
      </div>
    </div>
  );
}
