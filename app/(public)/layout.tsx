import Header from "@/components/layout/navigation/Header";
import Footer from "@/components/layout/navigation/Footer";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        className="flex flex-1 items-center justify-center"
        style={{
          background: "var(--gradient-primary)",
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}
