import Header from "./Header";
import Sidebar from "./Sidebar";

export default function GlobalLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F]">
      <Header />
      <div className="flex flex-1 mt-[40px]">
        
        <div className="w-[240px] h-[calc(100vh-56px)] pt-[15px] fixed left-0 ">
            <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 bg-[#0f0f0f] text-white ml-[240px]">
          {children}
        </main>

      </div>
    </div>
  );
}