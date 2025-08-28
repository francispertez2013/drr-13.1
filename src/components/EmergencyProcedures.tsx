import React, { useState, useEffect } from 'react';
import { Waves, Mountain, Zap, Cloud, Home, Flame, Globe, Thermometer, Calendar, AlertTriangle, Download, ChevronRight, Shield, Clock, CheckCircle } from 'lucide-react';

const EmergencyProcedures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('storm-surge');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Load external scripts for PDF generation
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      } catch (error) {
        console.error('Error loading PDF generation scripts:', error);
      }
    };

    loadScripts();
  }, []);

  const procedures = {
    'storm-surge': {
      icon: Waves,
      name: 'Storm Surge',
      color: 'from-blue-500 to-blue-600',
      accent: 'blue',
      before: [
        { title: 'Monitor Weather Alerts', description: 'Stay updated with official weather forecasts and storm surge warnings from PAGASA and local authorities.' },
        { title: 'Know Your Evacuation Zone', description: 'Identify if you live in a storm surge-prone area and familiarize yourself with evacuation routes and centers.' },
        { title: 'Prepare Emergency Kit', description: 'Pack essential supplies including food, water, medications, flashlight, batteries, and important documents.' },
        { title: 'Secure Your Property', description: 'Reinforce windows, secure outdoor furniture, and ensure proper drainage around your home.' }
      ],
      during: [
        { title: 'Evacuate Immediately', description: 'Follow evacuation orders without delay. Do not wait for conditions to worsen.' },
        { title: 'Move to Higher Ground', description: 'If trapped by rising water, move to the highest level of your building and signal for help.' },
        { title: 'Avoid Flood Waters', description: 'Never walk, swim, or drive through flood waters. Just 6 inches can knock you down.' },
        { title: 'Stay Informed', description: 'Listen to battery-powered radio for updates and emergency instructions from authorities.' }
      ],
      after: [
        { title: 'Wait for Official All-Clear', description: 'Do not return home until authorities declare it safe. Storm surge can occur in multiple waves.' },
        { title: 'Inspect for Damage', description: 'Check for structural damage, gas leaks, and electrical hazards before entering buildings.' },
        { title: 'Avoid Contaminated Water', description: 'Do not drink tap water until officials confirm it\'s safe. Boil water if advised.' },
        { title: 'Document Everything', description: 'Take photos of damage for insurance claims before cleaning up or making repairs.' }
      ]
    },
    'landslide': {
      icon: Mountain,
      name: 'Landslide',
      color: 'from-amber-500 to-orange-600',
      accent: 'amber',
      before: [
        { title: 'Learn Warning Signs', description: 'Watch for tilting trees, poles, or fences, cracks in ground, and unusual water flow patterns.' },
        { title: 'Develop Evacuation Plan', description: 'Plan multiple escape routes and identify safe areas away from steep slopes.' },
        { title: 'Install Safety Measures', description: 'Use flexible pipe fittings for utilities and consider professional slope stability assessment.' },
        { title: 'Emergency Preparedness', description: 'Keep emergency supplies ready and know two ways out of every room in your home.' }
      ],
      during: [
        { title: 'Move Away Quickly', description: 'Run perpendicular to the landslide path, not downhill or uphill in the same direction.' },
        { title: 'Protect Your Head', description: 'Shield yourself from falling debris and rocks while moving to safety.' },
        { title: 'Listen for Sounds', description: 'Be alert for unusual sounds that may indicate moving debris or additional slides.' },
        { title: 'Avoid Slope Areas', description: 'Stay away from the slide area and watch for flooding that may follow.' }
      ],
      after: [
        { title: 'Stay Away from Slide Area', description: 'Additional slides may occur. Keep a safe distance from the affected area.' },
        { title: 'Check for Casualties', description: 'Look for injured or trapped persons and provide assistance if safe to do so.' },
        { title: 'Report Hazards', description: 'Notify authorities of broken utility lines, damaged roads, or continued instability.' },
        { title: 'Seek Professional Help', description: 'Have land stability professionally evaluated before rebuilding or replanting.' }
      ]
    },
    'thunderstorm': {
      icon: Zap,
      name: 'Thunderstorm',
      color: 'from-purple-500 to-indigo-600',
      accent: 'purple',
      before: [
        { title: 'Monitor Weather Conditions', description: 'Track weather forecasts and thunderstorm warnings through reliable sources.' },
        { title: 'Secure Outdoor Items', description: 'Bring in or tie down outdoor furniture, decorations, and equipment that could become projectiles.' },
        { title: 'Prepare Your Home', description: 'Trim tree branches near your home and install surge protectors for electronics.' },
        { title: 'Charge Devices', description: 'Ensure all electronic devices and emergency equipment are fully charged.' }
      ],
      during: [
        { title: 'Seek Indoor Shelter', description: 'Go indoors immediately when thunder is heard. Avoid windows, doors, and porches.' },
        { title: 'Avoid Electrical Items', description: 'Stay away from electrical equipment, plumbing, and corded phones except for emergencies.' },
        { title: 'Vehicle Safety', description: 'If outdoors, seek shelter in a hard-topped vehicle with windows closed.' },
        { title: 'Lightning Safety', description: 'If caught outside, avoid tall objects and crouch low with feet together.' }
      ],
      after: [
        { title: 'Wait 30 Minutes', description: 'Stay indoors for 30 minutes after the last thunder before going outside.' },
        { title: 'Inspect for Damage', description: 'Check your property for damage, including roof, windows, and outdoor areas.' },
        { title: 'Report Hazards', description: 'Report downed power lines, damaged trees, or flooding to authorities immediately.' },
        { title: 'Help Others', description: 'Check on neighbors, especially elderly residents, and offer assistance if needed.' }
      ]
    },
    'typhoon': {
      icon: Cloud,
      name: 'Typhoon',
      color: 'from-slate-500 to-gray-700',
      accent: 'slate',
      before: [
        { title: 'Track the Storm', description: 'Monitor typhoon path, intensity, and evacuation orders from official sources.' },
        { title: 'Stock Emergency Supplies', description: 'Gather 72-hour supply of food, water, medications, and essential items.' },
        { title: 'Secure Your Property', description: 'Install storm shutters, board windows, and secure or remove outdoor items.' },
        { title: 'Prepare for Power Loss', description: 'Fill bathtubs with water, charge devices, and test emergency equipment.' }
      ],
      during: [
        { title: 'Stay Indoors', description: 'Remain inside and away from windows. Move to an interior room on the lowest floor.' },
        { title: 'Monitor Updates', description: 'Listen to battery-powered radio for official updates and emergency instructions.' },
        { title: 'Avoid Candles', description: 'Use flashlights instead of candles to prevent fire hazards during power outages.' },
        { title: 'Beware of the Eye', description: 'Do not go outside during the calm eye of the storm - winds will return.' }
      ],
      after: [
        { title: 'Wait for All-Clear', description: 'Do not venture outside until authorities declare it safe to do so.' },
        { title: 'Watch for Hazards', description: 'Be aware of flooding, storm surge, downed power lines, and damaged structures.' },
        { title: 'Generator Safety', description: 'Use generators outdoors only to prevent carbon monoxide poisoning.' },
        { title: 'Document Damage', description: 'Photograph damage for insurance claims before cleaning up or making repairs.' }
      ]
    },
    'flood': {
      icon: Waves,
      name: 'Flood',
      color: 'from-teal-500 to-cyan-600',
      accent: 'teal',
      before: [
        { title: 'Know Your Risk', description: 'Understand your area\'s flood risk and identify evacuation routes to higher ground.' },
        { title: 'Create Emergency Plan', description: 'Develop a family flood plan and sign up for community alert systems.' },
        { title: 'Prepare Emergency Kit', description: 'Keep emergency supplies in waterproof containers in an easily accessible location.' },
        { title: 'Consider Flood Insurance', description: 'Purchase flood insurance (requires 30-day waiting period before coverage begins).' }
      ],
      during: [
        { title: 'Move to Higher Ground', description: 'Evacuate to higher ground immediately when flooding begins or is imminent.' },
        { title: 'Avoid Moving Water', description: 'Never walk or drive through flood waters. Turn around, don\'t drown.' },
        { title: 'Stay Away from Power Lines', description: 'Avoid downed electrical lines and report them to authorities immediately.' },
        { title: 'Follow Evacuation Orders', description: 'Leave immediately if told to evacuate by emergency officials.' }
      ],
      after: [
        { title: 'Return Safely', description: 'Only return home when authorities confirm it\'s safe to do so.' },
        { title: 'Avoid Contaminated Water', description: 'Stay away from flood water which may contain sewage, chemicals, or debris.' },
        { title: 'Check for Damage', description: 'Inspect your home for structural damage before entering and using utilities.' },
        { title: 'Clean and Disinfect', description: 'Clean and disinfect everything that came in contact with flood water.' }
      ]
    },
    'earthquake': {
      icon: Globe,
      name: 'Earthquake',
      color: 'from-red-500 to-rose-600',
      accent: 'red',
      before: [
        { title: 'Secure Your Space', description: 'Anchor heavy furniture and appliances to walls. Secure breakable items.' },
        { title: 'Practice Drop, Cover, Hold', description: 'Regularly practice earthquake safety drills with all family members.' },
        { title: 'Identify Safe Spots', description: 'Know the safest places in each room - under sturdy tables or against interior walls.' },
        { title: 'Learn Utility Shutoffs', description: 'Know how to turn off gas, water, and electricity in case of damage.' }
      ],
      during: [
        { title: 'Drop, Cover, Hold On', description: 'Drop to hands and knees, take cover under sturdy furniture, hold on and protect your head.' },
        { title: 'Stay Where You Are', description: 'Do not run outside during shaking. Most injuries occur from falling objects.' },
        { title: 'If Outdoors', description: 'Move away from buildings, trees, and power lines. Drop to the ground and cover your head.' },
        { title: 'If Driving', description: 'Pull over safely, stop, and stay in the vehicle until shaking stops.' }
      ],
      after: [
        { title: 'Check for Injuries', description: 'Provide first aid for injuries and get help for seriously injured persons.' },
        { title: 'Inspect for Hazards', description: 'Check for gas leaks, electrical damage, and structural problems.' },
        { title: 'Be Prepared for Aftershocks', description: 'Expect aftershocks and be ready to drop, cover, and hold on again.' },
        { title: 'Stay Out of Damaged Buildings', description: 'Do not enter damaged structures until they are inspected by professionals.' }
      ]
    },
    'fire': {
      icon: Flame,
      name: 'Fire Emergency',
      color: 'from-orange-500 to-red-600',
      accent: 'orange',
      before: [
        { title: 'Install Smoke Alarms', description: 'Install smoke detectors on every level and check batteries monthly.' },
        { title: 'Create Escape Plan', description: 'Plan and practice fire escape routes with all family members.' },
        { title: 'Maintain Fire Safety', description: 'Keep fire extinguishers accessible and maintain clear escape routes.' },
        { title: 'Create Defensible Space', description: 'Clear vegetation and flammable materials around your property.' }
      ],
      during: [
        { title: 'Get Out Fast', description: 'Exit immediately and call 911 from a safe location outside.' },
        { title: 'Stay Low', description: 'Crawl under smoke to avoid inhaling toxic gases and to see better.' },
        { title: 'Test Doors', description: 'Feel doors before opening. If hot, use alternate escape route.' },
        { title: 'Never Go Back', description: 'Once outside, never return inside for belongings or pets.' }
      ],
      after: [
        { title: 'Stay Out', description: 'Do not enter the building until fire department declares it safe.' },
        { title: 'Watch for Hot Spots', description: 'Be aware of areas that may reignite and report them to firefighters.' },
        { title: 'Contact Insurance', description: 'Document damage with photos and contact your insurance company immediately.' },
        { title: 'Professional Inspection', description: 'Have the structure professionally inspected before reoccupying.' }
      ]
    },
    'tsunami': {
      icon: Waves,
      name: 'Tsunami',
      color: 'from-blue-600 to-indigo-700',
      accent: 'blue',
      before: [
        { title: 'Know Your Zone', description: 'Learn if you live in a tsunami hazard zone and know evacuation routes to higher ground.' },
        { title: 'Practice Evacuation', description: 'Practice evacuation drills and time how long it takes to reach safety.' },
        { title: 'Prepare Go-Bag', description: 'Keep an emergency kit ready for immediate evacuation.' },
        { title: 'Sign Up for Alerts', description: 'Register for tsunami warning alerts and emergency notifications.' }
      ],
      during: [
        { title: 'Move to Higher Ground', description: 'Evacuate immediately to higher ground or inland. Do not wait for official warnings.' },
        { title: 'Go Far and High', description: 'Move as far inland and as high as possible. Tsunamis can travel far inland.' },
        { title: 'Abandon Vehicles', description: 'If traffic is heavy, abandon your vehicle and continue on foot to higher ground.' },
        { title: 'Help Others', description: 'Assist others in evacuation if possible, but do not delay your own escape.' }
      ],
      after: [
        { title: 'Stay Away', description: 'Stay away from flooded and damaged areas until authorities declare them safe.' },
        { title: 'Beware of Series', description: 'Tsunamis come in series. The first wave may not be the largest.' },
        { title: 'Avoid Disaster Areas', description: 'Stay out of disaster areas to allow emergency responders to work.' },
        { title: 'Check Water Safety', description: 'Do not drink water that may have been contaminated by the tsunami.' }
      ]
    },
    'heat': {
      icon: Thermometer,
      name: 'Heat Emergency',
      color: 'from-yellow-500 to-red-500',
      accent: 'yellow',
      before: [
        { title: 'Prepare Cooling Systems', description: 'Ensure air conditioning works or identify air-conditioned public places nearby.' },
        { title: 'Check on Vulnerable People', description: 'Regularly check on elderly neighbors, relatives, and those with health conditions.' },
        { title: 'Learn Heat Illness Signs', description: 'Recognize symptoms of heat exhaustion and heat stroke for quick response.' },
        { title: 'Never Leave Anyone in Cars', description: 'Never leave people or pets in parked vehicles, even for short periods.' }
      ],
      during: [
        { title: 'Stay Cool Indoors', description: 'Remain in air-conditioned spaces as much as possible during extreme heat.' },
        { title: 'Drink Plenty of Water', description: 'Drink water regularly, even if you don\'t feel thirsty. Avoid alcohol and caffeine.' },
        { title: 'Dress Appropriately', description: 'Wear lightweight, light-colored, loose-fitting clothing.' },
        { title: 'Limit Outdoor Activities', description: 'Avoid outdoor activities during the hottest parts of the day (10 AM - 4 PM).' }
      ],
      after: [
        { title: 'Continue Monitoring', description: 'Keep watching weather forecasts for continued heat warnings.' },
        { title: 'Check on Others', description: 'Continue checking on family, friends, and neighbors for heat-related illness.' },
        { title: 'Seek Medical Attention', description: 'Get medical help immediately if you or others show signs of heat-related illness.' },
        { title: 'Gradual Return', description: 'Gradually return to normal outdoor activities as temperatures cool.' }
      ]
    }
  };

  const tabs = [
    { id: 'storm-surge', icon: Waves, name: 'Storm Surge' },
    { id: 'landslide', icon: Mountain, name: 'Landslide' },
    { id: 'thunderstorm', icon: Zap, name: 'Thunderstorm' },
    { id: 'typhoon', icon: Cloud, name: 'Typhoon' },
    { id: 'flood', icon: Waves, name: 'Flood' },
    { id: 'earthquake', icon: Globe, name: 'Earthquake' },
    { id: 'fire', icon: Flame, name: 'Fire' },
    { id: 'tsunami', icon: Waves, name: 'Tsunami' },
    { id: 'heat', icon: Thermometer, name: 'Heat' }
  ];

  const downloadPDF = (disasterType: string, phase: string) => {
    const currentProcedure = procedures[activeTab as keyof typeof procedures];
    if (!currentProcedure) return;

    const phaseData = currentProcedure[phase as keyof typeof currentProcedure] as Array<{title: string, description: string}>;
    if (!phaseData) return;

    // Create temporary element for PDF generation
    const tempElement = document.createElement('div');
    tempElement.style.padding = '20px';
    tempElement.style.fontFamily = 'Arial, sans-serif';
    tempElement.style.maxWidth = '600px';
    tempElement.style.backgroundColor = '#fff';
    
    // Add header
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="color: #172554; text-align: center; margin-bottom: 20px; font-size: 24px;">
        ${currentProcedure.name} - ${phase.charAt(0).toUpperCase() + phase.slice(1)} Procedures
      </h1>
      <hr style="margin-bottom: 20px; border: 1px solid #e2e8f0;">
    `;
    tempElement.appendChild(header);

    // Add content
    const content = document.createElement('div');
    phaseData.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.style.marginBottom = '15px';
      itemDiv.innerHTML = `
        <h3 style="color: #172554; font-size: 16px; margin-bottom: 5px;">
          ${index + 1}. ${item.title}
        </h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-left: 15px;">
          ${item.description}
        </p>
      `;
      content.appendChild(itemDiv);
    });
    tempElement.appendChild(content);

    // Add footer
    const footer = document.createElement('div');
    footer.innerHTML = `
      <hr style="margin-top: 20px; border: 1px solid #e2e8f0;">
      <p style="text-align: center; font-size: 12px; color: #666; margin-top: 10px;">
        MDRRMO Pio Duran - Emergency Procedures Guide - Generated on ${new Date().toLocaleDateString()}
      </p>
    `;
    tempElement.appendChild(footer);

    // Add to body temporarily
    document.body.appendChild(tempElement);

    // Generate PDF using html2canvas and jsPDF
    if (window.html2canvas && window.jspdf) {
      window.html2canvas(tempElement, {
        scale: 2,
        backgroundColor: '#fff'
      }).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        const filename = `${currentProcedure.name.replace(/\s+/g, '_')}_${phase}_procedures.pdf`;
        pdf.save(filename);
        
        document.body.removeChild(tempElement);
      });
    } else {
      console.error('PDF generation libraries not loaded');
      document.body.removeChild(tempElement);
    }
  };

  const renderProcedureCard = (title: string, items: Array<{title: string, description: string}>, icon: React.ReactNode, phase: string, index: number) => {
    const currentProcedure = procedures[activeTab as keyof typeof procedures];
    
    return (
      <div className={`group relative bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 shadow-lg md:shadow-xl border border-white/20 hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} 
           style={{ animationDelay: `${index * 150}ms` }}>
        
        {/* Download Button */}
        <button
          onClick={() => downloadPDF(activeTab, phase)}
          className={`absolute top-2 md:top-4 right-2 md:right-4 bg-gradient-to-r ${currentProcedure.color} text-white px-3 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-1 md:space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0`}
        >
          <Download size={12} />
          <span>PDF</span>
        </button>
        
        {/* Phase Header */}
        <div className="flex items-center space-x-3 md:space-x-2 mb-1 md:mb-2">
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br ${currentProcedure.color} shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-xs md:text-sm">Essential steps to follow</p>
          </div>
        </div>

        {/* Procedure Steps */}
        <div className="space-y-3 md:space-y-6">
          {items.map((item, stepIndex) => (
            <div key={stepIndex} className="group/item relative">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r ${currentProcedure.color} flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md`}>
                  {stepIndex + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1 md:mb-2 group-hover/item:text-blue-600 transition-colors text-sm md:text-base">
                    {item.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {stepIndex < items.length - 1 && (
                <div className={`absolute left-3 md:left-4 top-2 md:top-4 w-px h-4 md:h-6 bg-gradient-to-b ${currentProcedure.color} opacity-30`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Phase Indicator */}
        <div className="absolute -left-1 md:-left-2 top-2 md:top-4">
          <div className={`w-2 md:w-4 h-12 md:h-16 rounded-r-full bg-gradient-to-b ${currentProcedure.color} shadow-lg`}></div>
        </div>
      </div>
    );
  };

  const currentProcedure = procedures[activeTab as keyof typeof procedures] || procedures['storm-surge'];

  return (
    <section id="emergency-procedures" className="py-12 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                           linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-1 md:mb-2 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl md:rounded-3xl mb-2 md:mb-2 shadow-lg md:shadow-2xl">
            <AlertTriangle className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-2 md:mb-3">
            EMERGENCY PROCEDURES
          </h2>
          <div className="w-20 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full mb-2 md:mb-2"></div>
          <p className="text-sm md:text-md lg:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Comprehensive step-by-step procedures for before, during, and after emergency situations
          </p>
        </div>

        {/* Modern Tab Navigation */}
        <div className={`bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl border border-white/20 mb-4 md:mb-3 overflow-hidden ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="p-3 md:p-3">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex flex-col items-center gap-2 md:gap-3 p-2 md:p-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-br ${procedures[tab.id as keyof typeof procedures]?.color || 'from-blue-500 to-blue-600'} text-white shadow-xl scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <tab.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-center leading-tight text-xs">{tab.name}</span>
                  
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-0.5 md:-bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full shadow-lg"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Procedure Content */}
        <div className={`${isVisible ? 'animate-fadeIn' : 'opacity-0'} mobile-compact`} style={{ animationDelay: '400ms' }}>
          {/* Current Procedure Header */}
          <div className="text-center mb-2 md:mb-4">
            <div className="flex items-center justify-center mb-6">

            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-2">{currentProcedure.name} Emergency Procedures</h3>
            <p className="text-sm md:text-md lg:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
              Follow these comprehensive procedures to stay safe during {currentProcedure.name.toLowerCase()} emergencies
            </p>
          </div>

          {/* Procedure Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-4 mb-4 md:mb-8">
            {renderProcedureCard(
              'Before',
              currentProcedure.before,
              <Calendar size={20} className="text-white" />,
              'before',
              0
            )}
            {renderProcedureCard(
              'During',
              currentProcedure.during,
              <AlertTriangle size={20} className="text-white" />,
              'during',
              1
            )}
            {renderProcedureCard(
              'After',
              currentProcedure.after,
              <CheckCircle size={20} className="text-white" />,
              'after',
              2
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyProcedures;