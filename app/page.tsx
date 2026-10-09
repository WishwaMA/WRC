// app/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { X, Calendar, ArrowRight, Target, Compass, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from './components/Footer';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface NewsItem {
  id: string | number;
  category: string;
  title: string;
  date: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
}

interface EventItem {
  id: string | number;
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

interface PrincipalSettings {
  principalImage: string;
  principalQuote: string;
  principalMessage: string;
  principalName: string;
  principalTitle: string;
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

export default function Home() {
  const [isAnniversaryPassed, setIsAnniversaryPassed] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [firebaseNewsList, setFirebaseNewsList] = useState<NewsItem[]>([]);
  const [firebaseEventsList, setFirebaseEventsList] = useState<EventItem[]>([]);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    slides: [
      { id: "1", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600", title: "Empowering the Next Generation of Leaders", subtitle: "Welcome to Wayamba Royal College" },
      { id: "2", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600", title: "Excellence in Sports & Athletics", subtitle: "Building Strong Minds and Bodies" },
      { id: "3", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600", title: "Advanced Technological Education", subtitle: "Shining at Provincial IT Competitions" },
      { id: "4", image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1600", title: "Cultural & Aesthetic Brilliance", subtitle: "Showcasing Extraordinary Talents" },
      { id: "5", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600", title: "25 Years of Golden Legacy", subtitle: "Proudly Shaping Futures Since Inception" }
    ]
  });

  const [activeExamTab, setActiveExamTab] = useState<'al' | 'ol' | 'scholarship'>('al');

  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings>({
    schoolName: 'Wayamba Royal',
    subName: 'COLLEGE',
    logoText: 'WRC',
    logoImage: '',
  });

  const [principalSettings, setPrincipalSettings] = useState<PrincipalSettings>({
    principalImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600',
    principalQuote: 'Guiding Minds, Shaping Characters',
    principalMessage: 'At Wayamba Royal College, we believe in nurturing every student to reach their fullest potential.',
    principalName: 'Mr. K. R. Wickramasinghe',
    principalTitle: 'Principal, Wayamba Royal College'
  });

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
    const newsRef = ref(db, 'news');
    onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedNews: NewsItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setFirebaseNewsList(loadedNews.reverse());
      } else {
        setFirebaseNewsList([]);
      }
    });

    const eventsRef = ref(db, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEvents: EventItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setFirebaseEventsList(loadedEvents.reverse());
      } else {
        setFirebaseEventsList([]);
      }
    });

    const navbarRef = ref(db, 'settings/navbar');
    onValue(navbarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNavbarSettings(data);
    });

    const principalRef = ref(db, 'settings/principal');
    onValue(principalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPrincipalSettings(data);
    });

    const heroRef = ref(db, 'settings/hero');
    onValue(heroRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (Array.isArray(data.slides)) {
          setHeroSettings(data);
        } else if (data.slides && typeof data.slides === 'object') {
          const slidesArray: HeroSlideItem[] = Object.keys(data.slides).map(key => ({
            id: key,
            ...data.slides[key]
          }));
          setHeroSettings({ slides: slidesArray });
        }
      }
    });

    const examRef = ref(db, 'settings/exam');
    onValue(examRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parseItems = (catData: any): ExamItem[] => {
          if (!catData || !catData.items) return [];
          if (Array.isArray(catData.items)) return catData.items;
          return Object.keys(catData.items).map(k => ({ id: k, ...catData.items[k] }));
        };

        const formattedData: ExamSettings = {
          al: { items: parseItems(data.al).length > 0 ? parseItems(data.al) : examSettings.al.items },
          ol: { items: parseItems(data.ol).length > 0 ? parseItems(data.ol) : examSettings.ol.items },
          scholarship: { items: parseItems(data.scholarship).length > 0 ? parseItems(data.scholarship) : examSettings.scholarship.items }
        };
        setExamSettings(formattedData);
      }
    });
  }, []);

  useEffect(() => {
    if (!heroSettings.slides || heroSettings.slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % heroSettings.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSettings.slides.length]);

  useEffect(() => {
    const today = new Date();
    const targetAnniversaryDate = new Date(today.getFullYear(), 9, 15);
    if (today > targetAnniversaryDate) {
      setIsAnniversaryPassed(true);
    }
  }, []);

  const currentExamCategoryData = examSettings[activeExamTab] || examSettings.al;
  const currentSlide = heroSettings.slides[currentSlideIndex] || heroSettings.slides[0] || { id: "1", image: "", title: "", subtitle: "" };

  return (
    <main className="min-h-screen bg-gray-50 relative">
      <Navbar />

      <div className="relative bg-gray-900 text-white py-32 md:py-44 px-4 text-center overflow-hidden">
        {heroSettings.slides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlideIndex ? 'opacity-90 scale-105' : 'opacity-0 scale-100'}`}
            style={{ backgroundImage: `url('${slide.image}')`, transitionProperty: 'opacity, transform', transitionDuration: '1.2s' }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-black/25"></div>

        <div className="relative max-w-5xl mx-auto space-y-8 z-10 transition-all duration-500">
          <div className="inline-block bg-yellow-400 text-emerald-950 font-extrabold px-5 py-2 rounded-full text-sm md:text-base uppercase tracking-wider shadow-lg animate-pulse">
            {currentSlide.subtitle || "Welcome to Wayamba Royal College"}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl md:text-3xl font-bold tracking-wide text-yellow-300 uppercase drop-shadow-md">
              Welcome to
            </h2>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight drop-shadow-2xl leading-tight">
              <span className="text-white">{navbarSettings.schoolName || 'Wayamba Royal'}</span> <span className="text-yellow-400">{navbarSettings.subName || 'COLLEGE'}</span>
            </h1>
            <p className="text-base md:text-xl font-medium text-gray-100 max-w-3xl mx-auto pt-2 drop-shadow">
              {currentSlide.title || "Empowering the next generation of leaders."}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <a href="#news" className="bg-yellow-400 text-emerald-950 font-bold px-8 py-3.5 rounded-xl shadow-xl hover:bg-yellow-300 transition cursor-pointer text-base">Latest News</a>
            <a href="#about" className="bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-400 hover:text-emerald-950 transition cursor-pointer text-base shadow-lg">Learn More</a>
          </div>

          <div className="flex justify-center items-center gap-3 pt-6">
            <button 
              onClick={() => setCurrentSlideIndex((currentSlideIndex - 1 + heroSettings.slides.length) % heroSettings.slides.length)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition cursor-pointer border border-white/20 shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="flex gap-2.5">
              {heroSettings.slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-3 rounded-full transition-all duration-300 cursor-pointer shadow ${idx === currentSlideIndex ? 'w-10 bg-yellow-400' : 'w-3 bg-white/60 hover:bg-white'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentSlideIndex((currentSlideIndex + 1) % heroSettings.slides.length)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition cursor-pointer border border-white/20 shadow-md"
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-400 hover:-translate-y-2 transition duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-center font-bold"><Target size={24} className="text-emerald-900" /></div>
              <h3 className="text-xl font-extrabold text-emerald-950">WRC Vision</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Competent, smart citizens with balanced personalities who can face the challenge of a fast changing world.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-bold text-yellow-600 uppercase tracking-wider">Future Ready</div>
          </div>
          <div className="bg-emerald-900 text-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400 hover:-translate-y-2 transition duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-800/50 rounded-full blur-xl pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-yellow-400 text-emerald-950 rounded-xl flex items-center justify-center font-bold"><Compass size={24} /></div>
              <h3 className="text-xl font-extrabold text-yellow-400">WRC Mission</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">Providing an education from the Pre School to the GCE Advanced Level and all-round development of the student under a Sri Lankan cultural environment.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-800 text-xs font-bold text-yellow-300 uppercase tracking-wider relative z-10">Excellence in Culture</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-400 hover:-translate-y-2 transition duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center font-bold"><Award size={24} className="text-yellow-600" /></div>
              <h3 className="text-xl font-extrabold text-emerald-950">School Motto</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Striving towards ultimate wisdom, discipline, and success through dedication and perseverance.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-bold text-yellow-600 uppercase tracking-wider">Wisdom & Discipline</div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 items-center border border-emerald-100">
          <div className="h-72 md:h-full relative">
            <img src={principalSettings.principalImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600"} alt="Principal" className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-2 p-8 md:p-12 space-y-4">
            <span className="text-emerald-700 font-semibold tracking-wide uppercase text-sm">Principal's Message</span>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950">"{principalSettings.principalQuote || "Guiding Minds, Shaping Characters"}"</h2>
            <p className="text-gray-600 leading-relaxed">{principalSettings.principalMessage || "At Wayamba Royal College, we believe in nurturing every student to reach their fullest potential."}</p>
            <div className="pt-2">
              <span className="font-bold text-gray-950 block">{principalSettings.principalName || "Mr. K. R. Wickramasinghe"}</span>
              <span className="text-sm text-gray-500">{principalSettings.principalTitle || "Principal, Wayamba Royal College"}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-extrabold text-emerald-950">News & Announcements</h2>
          <p className="text-gray-600">Stay updated with the latest happenings and official notices.</p>
        </div>
        {firebaseNewsList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-emerald-50"><p className="text-gray-500">No news available at the moment.</p></div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x scrollbar-thin scrollbar-thumb-emerald-200">
            {firebaseNewsList.map((news) => (
              <div key={news.id} className="w-[85vw] sm:w-90 md:w-96 bg-white rounded-xl shadow-md overflow-hidden border border-emerald-50 hover:shadow-xl transition flex flex-col justify-between shrink-0 snap-start">
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span className="absolute top-4 left-4 bg-emerald-900 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full shadow">{news.category}</span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={14} className="text-emerald-700" /><span>{news.date}</span></div>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug">{news.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{news.shortDesc}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button onClick={() => setSelectedNews(news)} className="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-950 transition text-sm cursor-pointer">
                    <span>Read More</span><ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-emerald-50/50 rounded-3xl my-8 border border-emerald-100">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-extrabold text-emerald-950">Upcoming Events</h2>
          <p className="text-gray-600">Mark your calendars for our upcoming school activities and celebrations.</p>
        </div>
        {firebaseEventsList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-emerald-50"><p className="text-gray-500">No upcoming events at the moment.</p></div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x scrollbar-thin scrollbar-thumb-emerald-200">
            {firebaseEventsList.map((event) => (
              <div key={event.id} className="w-[85vw] sm:w-90 md:w-96 bg-white rounded-xl shadow-md overflow-hidden border border-emerald-50 hover:shadow-xl transition flex flex-col justify-between shrink-0 snap-start">
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span className="absolute top-4 left-4 bg-yellow-500 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full shadow">{event.category}</span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={14} className="text-emerald-700" /><span>{event.date}</span></div>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug">{event.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.shortDesc}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button onClick={() => setSelectedEvent(event)} className="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-950 transition text-sm cursor-pointer">
                    <span>Read More</span><ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-extrabold text-emerald-950">Academic Achievements & Results</h2>
          <p className="text-gray-600">Celebrating our students' brilliant milestones in national examinations.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-emerald-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-6">
            <h3 className="text-2xl font-bold text-emerald-950">Examination Highlights</h3>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveExamTab('al')} 
                className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${activeExamTab === 'al' ? 'bg-emerald-900 text-yellow-300 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                A/L Results
              </button>
              <button 
                onClick={() => setActiveExamTab('ol')} 
                className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${activeExamTab === 'ol' ? 'bg-emerald-900 text-yellow-300 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                O/L Results
              </button>
              <button 
                onClick={() => setActiveExamTab('scholarship')} 
                className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${activeExamTab === 'scholarship' ? 'bg-emerald-900 text-yellow-300 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Scholarship
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentExamCategoryData.items && currentExamCategoryData.items.map((item) => (
              <div key={item.id} className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 text-center space-y-2">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">{item.title}</span>
                <h4 className="text-3xl font-extrabold text-emerald-950">{item.value}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-700 transition cursor-pointer z-10"><X size={20} /></button>
            <div className="h-64 relative">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              <span className="absolute bottom-4 left-4 bg-emerald-900 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full shadow">{selectedNews.category}</span>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={16} className="text-emerald-700" /><span>{selectedNews.date}</span></div>
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-950">{selectedNews.title}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedNews.fullDesc}</p>
              <div className="pt-4 flex justify-end">
                <button onClick={() => setSelectedNews(null)} className="bg-emerald-900 text-yellow-300 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-950 transition cursor-pointer shadow">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-700 transition cursor-pointer z-10"><X size={20} /></button>
            <div className="h-64 relative">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <span className="absolute bottom-4 left-4 bg-yellow-500 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full shadow">{selectedEvent.category}</span>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={16} className="text-emerald-700" /><span>{selectedEvent.date}</span></div>
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-950">{selectedEvent.title}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedEvent.fullDesc}</p>
              <div className="pt-4 flex justify-end">
                <button onClick={() => setSelectedEvent(null)} className="bg-emerald-900 text-yellow-300 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-950 transition cursor-pointer shadow">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}