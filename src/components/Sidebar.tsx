import React from 'react';
import { 
  LayoutDashboard, Users, Bed, Calendar, 
  Pill, Receipt, Contact, FileText, Activity,
  Building2, Clock, Settings, X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
    { id: 'patients', label: 'Patients', icon: Users, section: 'Clinical', badge: '3' },
    { id: 'beds', label: 'Bed Management', icon: Bed, section: 'Clinical' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, section: 'Clinical' },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, section: 'Operations' },
    { id: 'billing', label: 'Billing', icon: Receipt, section: 'Operations' },
    { id: 'departments', label: 'Departments', icon: Building2, section: 'Operations' },
    { id: 'staff', label: 'Staff Directory', icon: Contact, section: 'Staff' },
    { id: 'schedules', label: 'Schedules', icon: Clock, section: 'Staff' },
    { id: 'reports', label: 'Reports', icon: FileText, section: 'Staff' },
    { id: 'configuration', label: 'Configuration', icon: Settings, section: 'System' },
  ];

  const sidebarClasses = `
    w-[220px] bg-surface border-r border-border-subtle flex flex-col shrink-0 
    hidden lg:flex
  `;

  const mobileDrawerClasses = `
    fixed inset-y-0 left-0 z-50 w-[280px] bg-surface border-r border-border-subtle 
    flex flex-col transform transition-transform duration-300 ease-in-out
    lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={sidebarClasses}>
        <div className="p-3.5 px-4 border-b border-border-subtle flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
            <Activity className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <div className="text-[14px] font-semibold leading-tight">Jyoshita Clinic HMS</div>
            <div className="text-[10px] text-gray-500">Hospital Management</div>
          </div>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const showSection = index === 0 || navItems[index - 1].section !== item.section;
            return (
              <React.Fragment key={item.id}>
                {showSection && (
                  <div className="text-[10px] text-gray-500 px-2 pt-3 pb-1 tracking-wider uppercase">
                    {item.section}
                  </div>
                )}
                <div 
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer text-[13px] mb-0.5 transition-all select-none
                    ${activeTab === item.id 
                      ? 'bg-accent-light text-accent-dark font-medium' 
                      : 'text-gray-500 hover:bg-surface2 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="w-[15px] h-[15px] shrink-0" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-danger text-white text-[10px] px-1.5 py-[1px] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-subtle">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
            <div className="w-[30px] h-[30px] rounded-full bg-accent-light flex items-center justify-center text-[11px] font-semibold text-accent-dark shrink-0">
              DR
            </div>
            <div>
              <div className="text-[12px] font-medium">Dr. Admin</div>
              <div className="text-[10px] text-gray-500">Chief Medical Officer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={mobileDrawerClasses}>
        <div className="p-3.5 px-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
              <Activity className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <div className="text-[14px] font-semibold leading-tight">Jyoshita HMS</div>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md hover:bg-surface2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const showSection = index === 0 || navItems[index - 1].section !== item.section;
            return (
              <React.Fragment key={item.id}>
                {showSection && (
                  <div className="text-[10px] text-gray-500 px-2 pt-3 pb-1 tracking-wider uppercase">
                    {item.section}
                  </div>
                )}
                <div 
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-md cursor-pointer text-[13px] mb-0.5 transition-all select-none
                    ${activeTab === item.id 
                      ? 'bg-accent-light text-accent-dark font-medium' 
                      : 'text-gray-500 hover:bg-surface2 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="w-[15px] h-[15px] shrink-0" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-danger text-white text-[10px] px-1.5 py-[1px] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-subtle">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
            <div className="w-[30px] h-[30px] rounded-full bg-accent-light flex items-center justify-center text-[11px] font-semibold text-accent-dark shrink-0">
              DR
            </div>
            <div>
              <div className="text-[12px] font-medium">Dr. Admin</div>
              <div className="text-[10px] text-gray-500">Chief Medical Officer</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
