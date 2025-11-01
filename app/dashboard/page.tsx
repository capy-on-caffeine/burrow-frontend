import { Navbar } from "@/components/navbar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-950">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-slate-800">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-slate-300" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 bg-slate-700"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-slate-400 hover:text-white">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-slate-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-slate-300">Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-4">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 aspect-video rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <h3 className="text-white font-semibold text-lg mb-2">Nodes Explored</h3>
                <p className="text-4xl font-bold text-orange-500">127</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 aspect-video rounded-xl p-6 hover:border-blue-500/50 transition-all">
                <h3 className="text-white font-semibold text-lg mb-2">Connections Made</h3>
                <p className="text-4xl font-bold text-blue-500">48</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 aspect-video rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <h3 className="text-white font-semibold text-lg mb-2">Hours Deep</h3>
                <p className="text-4xl font-bold text-orange-500">23.5</p>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 min-h-screen flex-1 rounded-xl md:min-h-min p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
              <p className="text-slate-400">Your knowledge graph journey will appear here...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
