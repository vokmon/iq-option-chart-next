import AppBreadcrumb from "@/components/display/breadcrumbs/AppBreadcrumb";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full w-full items-center px-4 py-8">
      <div className="self-start">
        <AppBreadcrumb skipPath={["trade"]} />
      </div>
      <div className="w-full pt-2">{children}</div>
    </div>
  );
}
