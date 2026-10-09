// app/admin/dashboard/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Newspaper, CalendarDays, BarChart3, Award, LogOut, Plus, Trash2, Calendar, CheckCircle, Edit3, X, Settings, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { ref, push, update, remove, onValue, set } from 'firebase/database';

interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
}

interface EventItem {
  id: string;
  category: string;
  title: string;
  date: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
}

interface NavbarSettings {
  schoolName: string;
  subName: string;
  logoText: string;
  logoImage: string;
}

interface FooterSettings {
  footerText: string;
}

interface PrincipalSettings {
  principalImage: string;
  principalQuote: string;
  principalMessage: string;
  principalName: string;
  principalTitle: string;
}

interface StatsSettings {
  totalStudents: string;
  qualifiedTeachers: string;
  sportsSocieties: string;
  yearsOfExcellence: string;
}

interface ExamItem {
  id: string;
  title: string;
  value: string;
  desc: string;
}

interface ExamCategoryData {
  items: ExamItem[];
}

interface ExamSettings {
  al: ExamCategoryData;
  ol: ExamCategoryData;
  scholarship: ExamCategoryData;
}

interface HeroSlideItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface HeroSettings {
  slides: HeroSlideItem[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<'news' | 'events' | 'stats' | 'exam' | 'hero' | 'settings'>('news');

  // News Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [date, setDate] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [image, setImage] = useState('');
  
  // Events Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Sports');
  const [eventDate, setEventDate] = useState('');
  const [eventShortDesc, setEventShortDesc] = useState('');
  const [eventFullDesc, setEventFullDesc] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active exam sub-tab for admin editing ('al', 'ol', 'scholarship')
  const [adminExamTab, setAdminExamTab] = useState<'al' | 'ol' | 'scholarship'>('al');

  // Separate Section States
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings>({
    schoolName: 'Wayamba Royal',
    subName: 'COLLEGE',
    logoText: 'WRC',
    logoImage: '',
  });

  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    footerText: 'Empowering the next generation of leaders.',
  });

  const [principalSettings, setPrincipalSettings] = useState<PrincipalSettings>({
    principalImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600',
    principalQuote: 'Guiding Minds, Shaping Characters',
    principalMessage: 'At Wayamba Royal College, we believe in nurturing every student to reach their fullest potential. Our dedicated staff combined with modern facilities ensure that our students excel not only in academics but also in sports, ethics, and leadership.',
    principalName: 'Mr. K. R. Wickramasinghe',
    principalTitle: 'Principal, Wayamba Royal College'
  });

  const [statsSettings, setStatsSettings] = useState<StatsSettings>({
    totalStudents: '2,500+',
    qualifiedTeachers: '120+',
    sportsSocieties: '25+',
    yearsOfExcellence: '25',
  });

  // Hero Slider Settings State
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    slides: [
      { id: "1", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600", title: "Empowering the Next Generation of Leaders", subtitle: "Welcome to Wayamba Royal College" },
      { id: "2", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600", title: "Excellence in Sports & Athletics", subtitle: "Building Strong Minds and Bodies" },
      { id: "3", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600", title: "Advanced Technological Education", subtitle: "Shining at Provincial IT Competitions" },
      { id: "4", image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1600", title: "Cultural & Aesthetic Brilliance", subtitle: "Showcasing Extraordinary Talents" },
      { id: "5", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600", title: "25 Years of Golden Legacy", subtitle: "Proudly Shaping Futures Since Inception" }
    ]
  });

  // Exam Results State
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    al: {
      items: [
        { id: "1", title: "University Selections", value: "85+ Students", desc: "Entered state universities across various streams." },
        { id: "2", title: "A/L Pass Rate", value: "96.5%", desc: "Consistent academic excellence year over year." },
        { id: "3", title: "District Ranks", value: "Top 10", desc: "Secured top positions in the Kurunegala district." }
      ]
    },
    ol: {
      items: [
        { id: "1", title: "A9 Holders", value: "45+ Students", desc: "Achieved distinctions in all subjects." },
        { id: "2", title: "O/L Pass Rate", value: "98.2%", desc: "Outstanding performance in national O/L examination." },
        { id: "3", title: "Qualified for A/L", value: "95%", desc: "Successfully qualified for advanced level streams." }
      ]
    },
    scholarship: {
      items: [
        { id: "1", title: "Pass Count", value: "35+ Students", desc: "Passed the Grade 5 scholarship examination." },
        { id: "2", title: "Cut-off Success", value: "92%", desc: "High percentage surpassing district cut-offs." },
        { id: "3", title: "Top District Scores", value: "175+ Marks", desc: "Brilliant scores achieved by our primary students." }
      ]
    }
  });

  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated');
    if (!auth) {
      router.push('/admin/login');
      return;
    }

    const newsRef = ref(db, 'news');
    onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedNews = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setNewsList(loadedNews.reverse());
      } else {
        setNewsList([]);
      }
    });

    const eventsRef = ref(db, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEvents = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setEventsList(loadedEvents.reverse());
      } else {
        setEventsList([]);
      }
    });

    const navbarRef = ref(db, 'settings/navbar');
    onValue(navbarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNavbarSettings(data);
    });

    const footerRef = ref(db, 'settings/footer');
    onValue(footerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setFooterSettings(data);
    });

    const principalRef = ref(db, 'settings/principal');
    onValue(principalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPrincipalSettings(data);
    });

    const statsRef = ref(db, 'settings/stats');
    onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setStatsSettings(data);
    });

    const heroRef = ref(db, 'settings/hero');
    onValue(heroRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.slides) {
        setHeroSettings(data);
      }
    });

    const examRef = ref(db, 'settings/exam');
    onValue(examRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData: ExamSettings = {
          al: { items: data.al?.items || [
            { id: "1", title: data.al?.stat1Title || "University Selections", value: data.al?.stat1Value || "85+ Students", desc: data.al?.stat1Desc || "Entered state universities." },
            { id: "2", title: data.al?.stat2Title || "A/L Pass Rate", value: data.al?.stat2Value || "96.5%", desc: data.al?.stat2Desc || "Consistent academic excellence." },
            { id: "3", title: data.al?.stat3Title || "District Ranks", value: data.al?.stat3Value || "Top 10", desc: data.al?.stat3Desc || "Secured top positions." }
          ]},
          ol: { items: data.ol?.items || [
            { id: "1", title: data.ol?.stat1Title || "A9 Holders", value: data.ol?.stat1Value || "45+ Students", desc: data.ol?.stat1Desc || "Achieved distinctions." },
            { id: "2", title: data.ol?.stat2Title || "O/L Pass Rate", value: data.ol?.stat2Value || "98.2%", desc: data.ol?.stat2Desc || "Outstanding performance." },
            { id: "3", title: data.ol?.stat3Title || "Qualified for A/L", value: data.ol?.stat3Value || "95%", desc: data.ol?.stat3Desc || "Successfully qualified." }
          ]},
          scholarship: { items: data.scholarship?.items || [
            { id: "1", title: data.scholarship?.stat1Title || "Pass Count", value: data.scholarship?.stat1Value || "35+ Students", desc: data.scholarship?.stat1Desc || "Passed the exam." },
            { id: "2", title: data.scholarship?.stat2Title || "Cut-off Success", value: data.scholarship?.stat2Value || "92%", desc: data.scholarship?.stat2Desc || "High percentage." },
            { id: "3", title: data.scholarship?.stat3Title || "Top District Scores", value: data.scholarship?.stat3Value || "175+ Marks", desc: data.scholarship?.stat3Desc || "Brilliant scores." }
          ]}
        };
        setExamSettings(formattedData);
      }
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/admin/login');
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "October 8, 2026";
      const newsData = {
        title,
        category,
        date: date ? formattedDate : "October 8, 2026",
        shortDesc,
        fullDesc,
        image: image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800"
      };

      if (editingId) {
        const itemRef = ref(db, `news/${editingId}`);
        await update(itemRef, newsData);
        setSuccessMsg('News successfully updated!');
        setEditingId(null);
      } else {
        const newsRef = ref(db, 'news');
        await push(newsRef, newsData);
        setSuccessMsg('News successfully published to Firebase!');
      }

      setTitle('');
      setShortDesc('');
      setFullDesc('');
      setImage('');
      setDate('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving news: ", error);
    }
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "October 25, 2026";
      const eventData = {
        title: eventTitle,
        category: eventCategory,
        date: eventDate ? formattedDate : "October 25, 2026",
        shortDesc: eventShortDesc,
        fullDesc: eventFullDesc,
        image: eventImage || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800"
      };

      if (editingEventId) {
        const itemRef = ref(db, `events/${editingEventId}`);
        await update(itemRef, eventData);
        setSuccessMsg('Upcoming Event successfully updated!');
        setEditingEventId(null);
      } else {
        const eventsRef = ref(db, 'events');
        await push(eventsRef, eventData);
        setSuccessMsg('Upcoming Event successfully published to Firebase!');
      }

      setEventTitle('');
      setEventShortDesc('');
      setEventFullDesc('');
      setEventImage('');
      setEventDate('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving event: ", error);
    }
  };

  const handleSaveNavbar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const navbarRef = ref(db, 'settings/navbar');
      await set(navbarRef, navbarSettings);
      setSuccessMsg('Navbar & Logo settings successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving navbar settings: ", error);
    }
  };

  const handleSavePrincipal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const principalRef = ref(db, 'settings/principal');
      await set(principalRef, principalSettings);
      setSuccessMsg('Principal message settings successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving principal settings: ", error);
    }
  };

  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const footerRef = ref(db, 'settings/footer');
      await set(footerRef, footerSettings);
      setSuccessMsg('Footer settings successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving footer settings: ", error);
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const statsRef = ref(db, 'settings/stats');
      await set(statsRef, statsSettings);
      setSuccessMsg('Statistics counter settings successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving statistics settings: ", error);
    }
  };

  // Hero Slider Handlers
  const handleAddHeroSlide = () => {
    const newSlide: HeroSlideItem = {
      id: Date.now().toString(),
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600",
      title: "New Slide Title",
      subtitle: "New Slide Subtitle"
    };
    setHeroSettings(prev => ({
      slides: [...prev.slides, newSlide]
    }));
  };

  const handleRemoveHeroSlide = (slideId: string) => {
    setHeroSettings(prev => ({
      slides: prev.slides.filter(s => s.id !== slideId)
    }));
  };

  const handleHeroSlideChange = (slideId: string, field: 'image' | 'title' | 'subtitle', value: string) => {
    setHeroSettings(prev => ({
      slides: prev.slides.map(s => s.id === slideId ? { ...s, [field]: value } : s)
    }));
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const heroRef = ref(db, 'settings/hero');
      await set(heroRef, heroSettings);
      setSuccessMsg('Hero slider settings successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving hero settings: ", error);
    }
  };

  const handleAddExamItem = (categoryKey: 'al' | 'ol' | 'scholarship') => {
    const newItem: ExamItem = {
      id: Date.now().toString(),
      title: "New Title",
      value: "0+",
      desc: "Enter description here."
    };
    setExamSettings(prev => ({
      ...prev,
      [categoryKey]: {
        items: [...prev[categoryKey].items, newItem]
      }
    }));
  };

  const handleRemoveExamItem = (categoryKey: 'al' | 'ol' | 'scholarship', itemId: string) => {
    setExamSettings(prev => ({
      ...prev,
      [categoryKey]: {
        items: prev[categoryKey].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const handleExamItemChange = (categoryKey: 'al' | 'ol' | 'scholarship', itemId: string, field: 'title' | 'value' | 'desc', value: string) => {
    setExamSettings(prev => ({
      ...prev,
      [categoryKey]: {
        items: prev[categoryKey].items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
      }
    }));
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const examRef = ref(db, 'settings/exam');
      await set(examRef, examSettings);
      setSuccessMsg('Exam results successfully updated with unlimited items!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error saving exam settings: ", error);
    }
  };

  const handleEditClick = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setDate('');
    setShortDesc(item.shortDesc);
    setFullDesc(item.fullDesc);
    setImage(item.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Academic');
    setDate('');
    setShortDesc('');
    setFullDesc('');
    setImage('');
  };

  const handleEditEventClick = (item: EventItem) => {
    setEditingEventId(item.id);
    setEventTitle(item.title);
    setEventCategory(item.category);
    setEventDate('');
    setEventShortDesc(item.shortDesc);
    setEventFullDesc(item.fullDesc);
    setEventImage(item.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEventEdit = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventCategory('Sports');
    setEventDate('');
    setEventShortDesc('');
    setEventFullDesc('');
    setEventImage('');
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        const itemRef = ref(db, `news/${id}`);
        await remove(itemRef);
      } catch (error) {
        console.error("Error deleting news: ", error);
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event item?')) {
      try {
        const itemRef = ref(db, `events/${id}`);
        await remove(itemRef);
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-emerald-950 text-emerald-100 flex flex-col justify-between p-6 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-emerald-900 pb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-emerald-950 font-bold">
              W
            </div>
            <div>
              <span className="font-bold text-white block text-sm">WRC Admin</span>
              <span className="text-xs text-yellow-400">Control Panel</span>
            </div>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('news')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition cursor-pointer ${activeTab === 'news' ? 'bg-emerald-900 text-yellow-400 shadow' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
            >
              <Newspaper size={18} /> Manage News
            </button>
            <button 
              onClick={() => setActiveTab('events')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition cursor-pointer ${activeTab === 'events' ? 'bg-emerald-900 text-yellow-400 shadow' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
            >
              <CalendarDays size={18} /> Manage Events
            </button>
            <button 
              onClick={() => setActiveTab('stats')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition cursor-pointer ${activeTab === 'stats' ? 'bg-emerald-900 text-yellow-400 shadow' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
            >
              <BarChart3 size={18} /> Manage Statistics
            </button>
            <button 
              onClick={() => setActiveTab('exam')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition cursor-pointer ${activeTab === 'exam' ? 'bg-emerald-900 text-yellow-400 shadow' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
            >
              <Award size={18} /> Exam Results
            </button>
            <button 
              onClick={() => setActiveTab('hero')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition cursor-pointer ${activeTab === 'hero' ? 'bg-emerald-900 text-yellow-400 shadow' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
            >
              <ImageIcon size={18} /> Hero Slider Settings
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition cursor-pointer ${activeTab === 'settings' ? 'bg-emerald-900 text-yellow-400 shadow' : 'hover:bg-emerald-900/50 text-emerald-300'}`}
            >
              <Settings size={18} /> Site & Logo Settings
            </button>
          </nav>
        </div>
        <div className="pt-6 border-t border-emerald-900">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <div>
            <h1 className="text-2xl font-bold text-emerald-950">Welcome, Administrator</h1>
            <p className="text-xs text-gray-500">Manage real-time announcements, logo & theme settings via Firebase.</p>
          </div>
          <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            Firebase Connected 🟢
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center gap-3 shadow-sm">
            <CheckCircle className="text-emerald-600" size={20} />
            <span className="font-medium text-sm">{successMsg}</span>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-10">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  {editingId ? <Edit3 className="text-yellow-600" size={22} /> : <Plus className="text-yellow-600" size={22} />} 
                  {editingId ? 'Edit Announcement' : 'Add New Announcement'}
                </h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1">
                    <X size={14} /> Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitNews} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="News Title" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                  <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Paste image link here" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Description</label>
                  <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Brief summary" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Description</label>
                  <textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} placeholder="Detailed description" rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required></textarea>
                </div>
                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  {editingId ? 'Update News' : 'Publish to Firebase'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <h2 className="text-xl font-bold text-emerald-950">Live Database News Items</h2>
              <div className="space-y-4">
                {newsList.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg shadow-sm shrink-0" />
                      <div className="space-y-1">
                        <span className="bg-emerald-900 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded">{item.category}</span>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={12} /><span>{item.date}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button onClick={() => handleEditClick(item)} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white p-2.5 rounded-lg transition cursor-pointer"><Edit3 size={18} /></button>
                      <button onClick={() => handleDeleteNews(item.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2.5 rounded-lg transition cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-10">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  {editingEventId ? <Edit3 className="text-yellow-600" size={22} /> : <Plus className="text-yellow-600" size={22} />} 
                  {editingEventId ? 'Edit Upcoming Event' : 'Add New Upcoming Event'}
                </h2>
                {editingEventId && (
                  <button onClick={handleCancelEventEdit} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1">
                    <X size={14} /> Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Event Title</label>
                    <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event Title" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                    <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Academic">Academic</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                  <input type="text" value={eventImage} onChange={(e) => setEventImage(e.target.value)} placeholder="Paste image link here" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Description</label>
                  <textarea value={eventShortDesc} onChange={(e) => setEventShortDesc(e.target.value)} placeholder="Brief summary" rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Description</label>
                  <textarea value={eventFullDesc} onChange={(e) => setEventFullDesc(e.target.value)} placeholder="Detailed description" rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required></textarea>
                </div>
                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  {editingEventId ? 'Update Event' : 'Publish Event to Firebase'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <h2 className="text-xl font-bold text-emerald-950">Live Database Upcoming Events</h2>
              <div className="space-y-4">
                {eventsList.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg shadow-sm shrink-0" />
                      <div className="space-y-1">
                        <span className="bg-yellow-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded">{item.category}</span>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={12} /><span>{item.date}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button onClick={() => handleEditEventClick(item)} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white p-2.5 rounded-lg transition cursor-pointer"><Edit3 size={18} /></button>
                      <button onClick={() => handleDeleteEvent(item.id)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2.5 rounded-lg transition cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <BarChart3 className="text-yellow-600" size={22} /> Statistics Counter Section Settings
              </h2>
              <form onSubmit={handleSaveStats} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total Students</label>
                    <input type="text" value={statsSettings.totalStudents} onChange={(e) => setStatsSettings({...statsSettings, totalStudents: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Qualified Teachers</label>
                    <input type="text" value={statsSettings.qualifiedTeachers} onChange={(e) => setStatsSettings({...statsSettings, qualifiedTeachers: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sports & Societies</label>
                    <input type="text" value={statsSettings.sportsSocieties} onChange={(e) => setStatsSettings({...statsSettings, sportsSocieties: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Years of Excellence</label>
                    <input type="text" value={statsSettings.yearsOfExcellence} onChange={(e) => setStatsSettings({...statsSettings, yearsOfExcellence: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                </div>
                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  Save Statistics Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Hero Slider Settings Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <ImageIcon className="text-yellow-600" size={22} /> Hero Slider Settings (Auto-sliding Banner Images & Texts)
                </h2>
                <button
                  type="button"
                  onClick={handleAddHeroSlide}
                  className="bg-yellow-400 text-emerald-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-yellow-300 transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus size={16} /> Add Slide Image
                </button>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-6">
                <div className="space-y-4">
                  {heroSettings.slides.map((slide, index) => (
                    <div key={slide.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm relative space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-900">Slide #{index + 1}</span>
                        {heroSettings.slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroSlide(slide.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition cursor-pointer"
                            title="Remove slide"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Image URL</label>
                          <input 
                            type="text" 
                            value={slide.image} 
                            onChange={(e) => handleHeroSlideChange(slide.id, 'image', e.target.value)} 
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Main Heading (Title)</label>
                          <input 
                            type="text" 
                            value={slide.title} 
                            onChange={(e) => handleHeroSlideChange(slide.id, 'title', e.target.value)} 
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Subtext / Badge Tag</label>
                          <input 
                            type="text" 
                            value={slide.subtitle} 
                            onChange={(e) => handleHeroSlideChange(slide.id, 'subtitle', e.target.value)} 
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  Save Hero Slider Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <Award className="text-yellow-600" size={22} /> Exam Results Section Settings (Unlimited Items Support)
                </h2>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setAdminExamTab('al')} 
                    className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${adminExamTab === 'al' ? 'bg-emerald-900 text-yellow-300 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    A/L Results
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAdminExamTab('ol')} 
                    className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${adminExamTab === 'ol' ? 'bg-emerald-900 text-yellow-300 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    O/L Results
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAdminExamTab('scholarship')} 
                    className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${adminExamTab === 'scholarship' ? 'bg-emerald-900 text-yellow-300 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Scholarship
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveExam} className="space-y-6">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-emerald-900 text-base uppercase">
                      Editing {adminExamTab.toUpperCase()} Examination Items ({examSettings[adminExamTab].items.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleAddExamItem(adminExamTab)}
                      className="bg-yellow-400 text-emerald-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-yellow-300 transition flex items-center gap-1.5 shadow"
                    >
                      <Plus size={16} /> Add New Stat Item
                    </button>
                  </div>

                  <div className="space-y-4 pt-2">
                    {examSettings[adminExamTab].items.map((item, index) => (
                      <div key={item.id} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm relative space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-800">Item #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExamItem(adminExamTab, item.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition"
                            title="Remove this item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Title</label>
                            <input 
                              type="text" 
                              value={item.title} 
                              onChange={(e) => handleExamItemChange(adminExamTab, item.id, 'title', e.target.value)} 
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Value</label>
                            <input 
                              type="text" 
                              value={item.value} 
                              onChange={(e) => handleExamItemChange(adminExamTab, item.id, 'value', e.target.value)} 
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Description</label>
                            <input 
                              type="text" 
                              value={item.desc} 
                              onChange={(e) => handleExamItemChange(adminExamTab, item.id, 'desc', e.target.value)} 
                              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium" 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  Save Exam Results Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <Settings className="text-yellow-600" size={22} /> Navbar & Logo Settings
              </h2>
              <form onSubmit={handleSaveNavbar} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">College Main Name</label>
                    <input type="text" value={navbarSettings.schoolName} onChange={(e) => setNavbarSettings({...navbarSettings, schoolName: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sub Title (e.g. COLLEGE)</label>
                    <input type="text" value={navbarSettings.subName} onChange={(e) => setNavbarSettings({...navbarSettings, subName: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default Logo Text (Fallback e.g. WRC)</label>
                    <input type="text" value={navbarSettings.logoText} onChange={(e) => setNavbarSettings({...navbarSettings, logoText: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Navbar Logo Image URL (Circle Image)</label>
                    <div className="flex gap-3 items-center">
                      <input type="text" value={navbarSettings.logoImage} onChange={(e) => setNavbarSettings({...navbarSettings, logoImage: e.target.value})} placeholder="https://example.com/logo.png" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                      {navbarSettings.logoImage && (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-300 shrink-0 bg-blue-900 flex items-center justify-center">
                          <img src={navbarSettings.logoImage} alt="Logo Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  Save Navbar Settings
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <Settings className="text-yellow-600" size={22} /> Principal's Message Section Settings
              </h2>
              <form onSubmit={handleSavePrincipal} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Principal Image URL</label>
                    <input type="text" value={principalSettings.principalImage || ""} onChange={(e) => setPrincipalSettings({...principalSettings, principalImage: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Principal Quote / Title Headline</label>
                    <input type="text" value={principalSettings.principalQuote || ""} onChange={(e) => setPrincipalSettings({...principalSettings, principalQuote: e.target.value})} placeholder='"Guiding Minds, Shaping Characters"' className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Principal Message Paragraph</label>
                  <textarea value={principalSettings.principalMessage || ""} onChange={(e) => setPrincipalSettings({...principalSettings, principalMessage: e.target.value})} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Principal Name</label>
                    <input type="text" value={principalSettings.principalName || ""} onChange={(e) => setPrincipalSettings({...principalSettings, principalName: e.target.value})} placeholder="Mr. K. R. Wickramasinghe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Principal Designation / Sub Title</label>
                    <input type="text" value={principalSettings.principalTitle || ""} onChange={(e) => setPrincipalSettings({...principalSettings, principalTitle: e.target.value})} placeholder="Principal, Wayamba Royal College" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  Save Principal Settings
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-emerald-100 space-y-6">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <Settings className="text-yellow-600" size={22} /> Footer Settings
              </h2>
              <form onSubmit={handleSaveFooter} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Footer Description Text</label>
                  <textarea value={footerSettings.footerText} onChange={(e) => setFooterSettings({...footerSettings, footerText: e.target.value})} rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"></textarea>
                </div>
                <button type="submit" className="bg-emerald-900 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-emerald-950 transition shadow cursor-pointer text-sm">
                  Save Footer Settings
                </button>
              </form>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}