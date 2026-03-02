"use client";
import { useEffect, useState } from 'react'; // Bỏ useRef vì không dùng nữa
import { supabase } from '@/lib/supabase';
// Import các thành phần biểu đồ
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { 
  Play, Users, TrendingUp, Youtube, Facebook, 
  Instagram, Music, CheckCircle2, Clock, MessageCircle, ThumbsUp, 
  Loader2, MapPin, CalendarDays, Star, ExternalLink, 
  ChevronLeft, ChevronRight, ArrowRight, Radio, ChevronDown
} from 'lucide-react';

// --- CẤU HÌNH LIÊN KẾT & VIDEO ---
const VIDEO_URLS = [
  'https://www.youtube.com/watch?v=sZrIbpwjTwk', // Éch Ngòai Đáy Giếng
  'https://www.youtube.com/watch?v=V1ah6tmNUz8', // Vũ Trụ Có Anh
  'https://www.youtube.com/watch?v=Jh6Xz1WD3C0&list=RDJh6Xz1WD3C0&start_radio=1', // Hề
  'https://www.youtube.com/watch?v=BmrdGQ0LRRo', // Bóng Phù Hoa
  'https://www.youtube.com/watch?v=KGS6GU16Uqc', // Buôn Trăng
  'https://www.youtube.com/watch?v=cU1GSszAVi4', // Mashup Túy Âm
];

const SOCIAL_LINKS = {
  facebook: "https://facebook.com/phuongmychi",
  youtube: "https://youtube.com/@PhuongMyChiOfficial",
  spotify: "https://open.spotify.com/artist/1BcjfrXV4Oe3fK0c8dnxFF", 
  instagram: "https://www.instagram.com/phuongmychi/" 
};

const YOUTUBE_API_KEY = "AIzaSyAueu53W-r0VWcYJwYrSSboOKuWYQfLn34"; 

// Dữ liệu Spotify
const SPOTIFY_DATA = [
  { id: 1, title: "Vũ Trụ Có Anh", artists: "Phương Mỹ Chi, DTAP, Pháo", duration: "03:40", link: "https://open.spotify.com/track/4bOwnJwm4Zy1vjnndHFLHj?si=5c9a5bc7425a4b9d" },
  { id: 2, title: "Bóng Phù Hoa", artists: "Phương Mỹ Chi, DTAP", duration: "04:34", link: "https://open.spotify.com/track/3fw9v7CztM2mqu1jCtbg9f?si=ace149bcfd954d2a" },
  { id: 3, title: "Gối Gấm", artists: "Phương Mỹ Chi, DTAP", duration: "03:16", link: "https://open.spotify.com/track/211PBKJlAG1CxXUEjN5nqq?si=f356489962934e4e" },
  { id: 4, title: "Đẩy Xe Bò", artists: "Phương Mỹ Chi, DTAP", duration: "02:45", link: "https://open.spotify.com/track/513yY4zlOPYCAnqH614sl1?si=e48c22d434544c13" },
  { id: 5, title: "Ếch Ngoài Đáy Giếng", artists: "Phương Mỹ Chi", duration: "03:52", link: "https://open.spotify.com/album/3BGhIjI8DZUSqwAC8u2kka?si=nOD4amt0TMG_gzsX1AbJeQ" },
];

// Dữ liệu Hành trình (Dùng cho Tab Giới thiệu)
const MILESTONES = [
  {
    id: 1,
    year: "2013",
    date: "07/09/2013",
    category: "THE DEBUT",
    title: "Á QUÂN GIỌNG HÁT VIỆT NHÍ",
    desc: "Phương Mỹ Chi bắt đầu hành trình âm nhạc khi tham gia Giọng Hát Việt Nhí mùa đầu tiên. Với chất giọng dân ca ngọt ngào, cô bé đã chinh phục hàng triệu trái tim khán giả và giành ngôi vị Á quân, mở ra kỷ nguyên mới cho dòng nhạc dân gian đương đại.",
    image: "https://thanhnien.mediacdn.vn/Uploaded/2014/Pictures20136/PhuongThanh/ghvn2/mychi1.JPG"
  },
  {
    id: 2,
    year: "2023",
    date: "18/09/2023",
    category: "NEW ERA",
    title: "ALBUM VŨ TRỤ CÒ BAY",
    desc: "Đánh dấu sự lột xác ngoạn mục thoát khỏi hình ảnh 'cô bé dân ca', Phương Mỹ Chi ra mắt album 'Vũ Trụ Cò Bay' kết hợp giữa văn học Việt Nam và các chất liệu âm nhạc hiện đại (Disco, Folktronica), khẳng định tư duy nghệ thuật đột phá của Gen Z.",
    image: "https://i.scdn.co/image/ab67616d0000b27371dea61e1ce07e18c746d775"
  },
  {
    id: 3,
    year: "2024",
    date: "10/01/2024",
    category: "ACHIEVEMENT",
    title: "GIẢI THƯỞNG LÀN SÓNG XANH",
    desc: "Tại lễ trao giải Làn Sóng Xanh 2023, Phương Mỹ Chi đã chiến thắng hạng mục 'Gương mặt mới xuất sắc', đây là minh chứng cho sự công nhận của giới chuyên môn và khán giả đối với những nỗ lực không ngừng nghỉ của Chi trong suốt một thập kỷ.",
    image: "https://cdnphoto.dantri.com.vn/KHkLPKrVKtmQzp-sCm80B5apfRw=/thumb_w/1020/2024/01/25/moment136-1706139576419.jpg"
  },
  {
    id: 4,
    year: "2025",
    date: "21/02/2025",
    category: "ACHIEVEMENT",
    title: "PHIM ĐIỆN ẢNH 'NHÀ GIA TIÊN'",
    desc: "Với vai diễn trong bộ phim điện ảnh Nhà Gia Tiên ra mắt vào ngày 23/02/2024, Phương Mỹ Chi đã có bước chuyển mình đáng chú ý khi thử sức ở lĩnh vực điện ảnh. Sự thể hiện tròn vai, giàu cảm xúc của Chi cho thấy khả năng biến hóa và tinh thần nghiêm túc với nghệ thuật, qua đó khẳng định hình ảnh một nghệ sĩ trẻ không ngừng học hỏi và mở rộng giới hạn bản thân.",
    image: "https://cdn2.tuoitre.vn/471584752817336320/2025/2/18/image001-1-resize-1739880121041644544719.jpg"
  },
  {
    id: 5,
    year: "2025",
    date: "18/07/2025",
    category: "ACHIEVEMENT",
    title: "QUÝ QUÂN SING ASIA",
    desc: "Tại đêm Chung kết chương trình Sing Asia diễn ra ngày 18/07/2025, Phương Mỹ Chi đã xuất sắc giành danh hiệu Quý quân. Thành tích này đánh dấu cột mốc quan trọng trong hành trình vươn ra sân chơi âm nhạc khu vực, đồng thời là minh chứng cho năng lực chuyên môn, bản lĩnh sân khấu và khả năng lan tỏa âm nhạc mang bản sắc Việt Nam đến khán giả quốc tế.",
    image: "https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/6/27/6c1b237300c84b39a4c178ab142f31d7"
  },
  {
    id: 6,
    year: "2025",
    date: "23/09/2025",
    category: "ACHIEVEMENT",
    title: "QUÁN QUÂN EM XINH SAY HI",
    desc: "Chiến thắng ngôi vị Quán quân chương trình Em Xinh Say Hi là sự ghi nhận xứng đáng cho hành trình nỗ lực, bền bỉ và không ngừng đổi mới của Phương Mỹ Chi. Qua chương trình, Chi cho thấy sự trưởng thành rõ nét trong tư duy âm nhạc, cá tính nghệ sĩ và khả năng kết nối với khán giả trẻ, củng cố vị trí vững chắc trong thế hệ nghệ sĩ Gen Z.",
    image: "https://cdn.giaoducthoidai.vn/images/a9c03e1761dda818fc463abc1a45d96f28b7ebbeefc60e0f56f295b46ce3b313ab47f1e8bbb0b8ba36a3a7145f53dc39/phuong-my-chi-1.jpg"
  }
];

// Dữ liệu Lịch trình
const SCHEDULE_EVENTS = [
  { id: 1, date: "May 5, 2026", time: "12:00 - 16:00", title: "VŨ TRỤ CÒ BAY - CONCERT TOUR", location: "OECD CENTER, PARIS", image: "https://vmasgroup.com/wp-content/uploads/2024/05/VU-TRU-CO-BAY.png" },
  { id: 2, date: "June 12, 2026", time: "19:00 - 22:00", title: "ĐÊM NHẠC TRỮ TÌNH QUÊ HƯƠNG", location: "NHÀ HÁT THÀNH PHỐ, HCM", image: "https://i.scdn.co/image/ab67616d0000b27371dea61e1ce07e18c746d775" },
  { id: 2, date: "June 12, 2026", time: "19:00 - 22:00", title: "ĐÊM NHẠC TRỮ TÌNH QUÊ HƯƠNG", location: "NHÀ HÁT THÀNH PHỐ, HCM", image: "https://i.scdn.co/image/ab67616d0000b27371dea61e1ce07e18c746d775" }
];

const getVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
const formatCompact = (num) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);

// --- COMPONENT BACKGROUND NGHỆ THUẬT ---
const ArtisticBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <style jsx>{`
      @keyframes floatUp { 0% { transform: translateY(0) translateX(0); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-100vh) translateX(20px); opacity: 0; } }
      @keyframes birdFly { 0% { transform: translateX(-10vw) scale(0.5); opacity: 0; } 20% { opacity: 0.1; } 100% { transform: translateX(110vw) scale(1); opacity: 0; } }
      .star-particle { position: absolute; background: #D4AF37; border-radius: 50%; animation: floatUp linear infinite; }
      .bird-svg { position: absolute; fill: rgba(255, 255, 255, 0.03); animation: birdFly linear infinite; }
    `}</style>
    {[...Array(20)].map((_, i) => (
      <div key={i} className="star-particle" style={{ width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px', left: Math.random() * 100 + '%', top: '100%', animationDuration: Math.random() * 10 + 10 + 's', animationDelay: Math.random() * 15 + 's' }} />
    ))}
    <svg className="bird-svg" style={{ top: '30%', animationDuration: '40s' }} viewBox="0 0 24 24" width="120"><path d="M21,5c-5,0-9,4-9,4s-4-4-9-4c0,0,3,4,9,4S21,5,21,5z" /></svg>
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false); // State để check cuộn trang
  const [stats, setStats] = useState([]);
  const [videoStats, setVideoStats] = useState([]); 
  const [spotifyChartData, setSpotifyChartData] = useState([]);
  const [latest, setLatest] = useState({ view: 0, sub: 0 });
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  /// --- LOGIC CUỘN HEADER ---
  useEffect(() => {
    const handleScroll = () => {
      // Threshold 20px giúp chuyển trạng thái nhạy hơn
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hàm chuyển tab kết hợp cuộn lên đầu trang
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- FETCH DATA (SUPABASE) ---
  useEffect(() => {
    const fetchSupabaseData = async () => {
      // 1. YouTube Tổng
      const { data: channelData } = await supabase.from('pmc_stats').select('*').order('created_at', { ascending: true }).limit(100);
      if (channelData && channelData.length > 0) {
        setStats(channelData.filter(i => i.metric_type === 'view_count').map(i => ({ value: i.value, date: new Date(i.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) })));
        setLatest({
          view: channelData.filter(i => i.metric_type === 'view_count').pop()?.value || 0,
          sub: channelData.filter(i => i.metric_type === 'subscriber_count').pop()?.value || 0
        });
      }

      // 2. YouTube Video Chi Tiết
      const { data: vData } = await supabase.from('pmc_video_stats').select('*').order('created_at', { ascending: false }).limit(50);
      
      if (vData) {
        const uniqueVideos = [];
        const map = new Map();
        for (const item of vData) {
            if(!map.has(item.video_id)) {
                map.set(item.video_id, true);
                uniqueVideos.push({
                    name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
                    fullTitle: item.title,
                    views: item.view_count,
                    likes: item.like_count,
                    comments: item.comment_count
                });
            }
        }
        setVideoStats(uniqueVideos); // <-- Đã đặt vào đúng chỗ, hết lỗi
      }

      // 3. Spotify Stats
      const { data: sData } = await supabase.from('pmc_spotify_stats').select('*').order('streams', { ascending: false });
      if (sData) {
        setSpotifyChartData(sData);
      }
    };
    fetchSupabaseData();
  }, []);

  // --- FETCH YOUTUBE API (HIỂN THỊ VIDEO) ---
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const ids = VIDEO_URLS.map(url => getVideoId(url)).filter(id => id).join(',');
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${YOUTUBE_API_KEY}`);
        const data = await res.json();
        if (data.items) {
          const formattedVideos = data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumb: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url,
            views: formatCompact(item.statistics.viewCount),
            likes: formatCompact(item.statistics.likeCount),
            comments: formatCompact(item.statistics.commentCount),
            link: `https://www.youtube.com/watch?v=${item.id}`
          }));
          setVideos(formattedVideos);
        }
      } catch (error) { console.error(error); } finally { setLoadingVideos(false); }
    };
    if (YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes("DÁN")) fetchVideoDetails();
    else {
      setVideos(VIDEO_URLS.map((url, index) => ({
        id: index, title: "Video Youtube (Cần API Key)", views: "1.2M", likes: "50K", comments: "2K", thumb: `https://img.youtube.com/vi/${getVideoId(url)}/maxresdefault.jpg`, link: url
      })));
      setLoadingVideos(false);
    }
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'about':
        return (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
            {MILESTONES.map((item) => (
              <div key={item.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-pmc-gold/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-pmc-gold text-xs font-bold px-3 py-1 rounded-full border border-zinc-700">{item.year}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-pmc-gold transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed mb-4">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'streaming':
        return (
          <div className="animate-fade-in max-w-7xl mx-auto space-y-10">
            {/* Header Streaming */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Streaming Guide</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Hướng dẫn stream nhạc đúng cách trên các nền tảng để tối ưu hóa thành tích cho Phương Mỹ Chi.</p>
            </div>

            {/* Grid 3 Cột cho 3 Nền tảng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. YOUTUBE GUIDE */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 p-20 bg-red-600/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-6">
                  <Youtube size={32} className="text-red-500" />
                  <h3 className="text-2xl font-bold text-white">YouTube</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {[
                    "Không tắt tiếng (Volume > 50%)",
                    "Chất lượng video tối thiểu 720p",
                    "Không tua video, xem hết quảng cáo",
                    "Không replay (phát lại) ngay lập tức",
                    "Xen kẽ 2-3 video khác giữa các lần xem"
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle2 size={18} className="text-red-500 min-w-[18px] mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. SPOTIFY GUIDE */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 p-20 bg-green-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-6">
                  <Music size={32} className="text-[#1DB954]" />
                  <h3 className="text-2xl font-bold text-white">Spotify</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {[
                    "Không tắt tiếng thiết bị & ứng dụng",
                    "Không dùng chế độ ẩn danh",
                    "Tạo Playlist xen kẽ bài hát khác",
                    "Không loop 1 bài liên tục (Repeat 1)",
                    "Share bài hát lên MXH sau khi nghe"
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle2 size={18} className="text-[#1DB954] min-w-[18px] mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. STATIONHEAD GUIDE (MỚI) */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 p-20 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-6">
                  <Radio size={32} className="text-blue-500" />
                  <h3 className="text-2xl font-bold text-white">Stationhead</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {[
                    "Liên kết tài khoản Premium (Spotify/Apple)",
                    "Không tắt tiếng trên App (chỉ tắt tab)",
                    "Giữ tương tác/chat để không bị kick",
                    "Follow đúng Station chính thức của FC",
                    "Giữ kết nối ổn định trong suốt Party"
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle2 size={18} className="text-blue-500 min-w-[18px] mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* General Tips & Button */}
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-pmc-gold mb-1">Lưu ý quan trọng</h4>
                <p className="text-gray-400 text-sm">Hãy đăng nhập tài khoản chính chủ để lượt stream được tính chuẩn xác nhất.</p>
              </div>
              <div className="flex gap-3">
                 <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition text-sm">
                  Tham gia Group Stream
                </button>
                 <button className="px-6 py-3 border border-zinc-600 text-white font-bold rounded-full hover:bg-zinc-800 transition text-sm">
                  Tải Stationhead
                </button>
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="animate-fade-in space-y-16 pt-10 font-sans">
            <div className="relative overflow-hidden py-10 border-y border-zinc-800">
              <style jsx>{` @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .marquee { display: inline-block; animation: marquee 20s linear infinite; white-space: nowrap; } `}</style>
              <h2 className="marquee text-6xl md:text-9xl font-black text-white/5 uppercase"> LATEST EVENTS • LATEST SHOWS • LATEST EVENTS • LATEST SHOWS • </h2>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> <h3 className="text-4xl md:text-6xl font-serif font-bold text-pmc-gold drop-shadow-2xl"></h3> </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {SCHEDULE_EVENTS.map((event) => (
                <div key={event.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-pmc-gold/50 transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />
                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest">{event.date}</div>
                    <button className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-pmc-gold text-black font-black uppercase text-[10px] tracking-widest opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.5)]">Chi tiết</button>
                  </div>
                  <div className="p-8 flex justify-between items-end">
                    <div> <p className="text-[10px] font-bold text-pmc-gold mb-2 uppercase tracking-widest">Sự kiện tiêu điểm</p> <h4 className="text-xl font-serif font-bold text-white uppercase">{event.title}</h4> <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><MapPin size={12}/> {event.location}</p> </div>
                    <ArrowRight className="text-zinc-600 group-hover:text-pmc-gold transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900/50 rounded-[3rem] p-8 md:p-16 border border-zinc-800 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h4 className="text-4xl font-serif font-bold text-white leading-tight">Vũ Trụ Sự Kiện</h4>
                <p className="text-gray-400 font-lora text-lg italic">"Hãy cùng Chi viết tiếp những trang ký ức âm nhạc tuyệt vời nhất."</p>
                <button className="px-10 py-4 bg-pmc-gold text-black font-black rounded-full hover:scale-105 transition shadow-xl">ĐĂNG KÝ NHẬN THÔNG BÁO</button>
              </div>
              <div className="rounded-3xl overflow-hidden h-96 grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669726937102!2d106.6648812759058!3d10.760671159501532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4ee45%3A0x6fb86b889387d83!2zTmjDoCBIw6F0IEjDsmEgQsOsbmggLSBUUC5IQ00!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0 }}></iframe>
              </div>
            </div>
          </div>
        );
      
      case 'stats':
        return (
            <div className="animate-fade-in space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Biểu đồ 1 */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><TrendingUp className="text-red-500"/> Total Channel Growth</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer>
                            <AreaChart data={stats}>
                              <defs><linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                              <YAxis stroke="#666" fontSize={12} tickFormatter={(val)=>`${(val/1000000).toFixed(1)}M`} tickLine={false} />
                              <Tooltip contentStyle={{backgroundColor: '#18181b', border: '1px solid #333', color: '#fff'}} />
                              <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorView)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Biểu đồ 2 */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Play className="text-pmc-gold"/> Top Videos Performance</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer>
                            <BarChart data={videoStats} layout="vertical" margin={{left: 20}}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                              <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={(val)=>`${(val/1000000).toFixed(1)}M`} />
                              <YAxis dataKey="name" type="category" stroke="#fff" fontSize={11} width={100} />
                              <Tooltip 
                                cursor={{fill: '#33333333'}}
                                contentStyle={{backgroundColor: '#18181b', border: '1px solid #D4AF37', color: '#fff'}} 
                                formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                              />
                              <Bar dataKey="views" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} name="Lượt xem" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Biểu đồ 3: Spotify */}
                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Music className="text-[#1DB954]"/> Spotify Most Streamed Tracks</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer>
                        <BarChart data={spotifyChartData} layout="vertical" margin={{left: 40}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                          <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={(val)=>`${(val/1000000).toFixed(1)}M`} />
                          <YAxis dataKey="title" type="category" stroke="#fff" fontSize={12} width={150} />
                          <Tooltip 
                            cursor={{fill: '#33333333'}}
                            contentStyle={{backgroundColor: '#18181b', border: '1px solid #1DB954', color: '#fff'}} 
                            formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                          />
                          <Bar dataKey="streams" fill="#1DB954" radius={[0, 4, 4, 0]} barSize={25} name="Lượt nghe" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );

      default: // HOME
        return (
          <div className="space-y-12 animate-fade-in pt-10 relative z-10">
             {/* --- PHẦN NỘI DUNG MỚI: LỜI TỰA (NHƯ TRONG CLIP) --- */}
             <div className="py-16 md:py-24 max-w-4xl mx-auto px-6 text-center border-b border-zinc-800/50">
                <h2 className="text-pmc-gold font-serif text-3xl md:text-4xl mb-8 tracking-wide">The Narrative</h2>
                <div className="prose prose-invert prose-lg mx-auto">
                  <p className="text-xl md:text-2xl font-Lora text-gray-300 leading-relaxed font-light italic">
                    "Năm 2013, Phương Mỹ Chi đã làm say đắm cả một thế hệ với hình ảnh ‘cô bé dân ca’, sở hữu giọng hát trong trẻo như pha lê, thổi hồn vào những giai điệu đậm đà bản sắc Việt. Sau hơn một thập kỷ, cô bé ngày nào đã trưởng thành, tỏa sáng như một biểu tượng tiên phong của nghệ thuật đương đại. Năm 2023 với album Vũ Trụ Cò Bay – Chi đã tạo nên một bản hòa quyện đầy mê hoặc, nơi chất liệu dân gian truyền thống giao thoa cùng nhịp đập sôi động của pop hiện đại."
                  </p>
                  <p className="mt-6 text-gray-400 font-light">
                    Sự chuyển mình ấy đánh dấu hành trình từ người gìn giữ giá trị truyền thống trở thành một biểu tượng văn hóa mới, tái hiện tinh thần văn học cổ điển qua lăng kính của thế hệ số. Bằng cách kết nối tinh tế giữa hoài niệm và tinh thần tiên phong, Phương Mỹ Chi trở thành nhịp cầu sáng tạo nối liền các thời đại.
                  </p>
                </div>
             </div>

             {/* DASHBOARD CONTENT (Nội dung cũ của Home) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Youtube size={28} /></div>
                    <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm font-semibold">Total Channel Views</p>
                    <h3 className="text-4xl font-serif font-bold text-white">{formatCompact(latest.view)}</h3>
                  </div>
                </div>
                <div className="md:col-span-2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm relative overflow-hidden">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><TrendingUp size={20} className="text-yellow-500"/> Real-time Growth</h3>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%"><AreaChart data={stats}><defs><linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{backgroundColor: '#18181b', border: '1px solid #333', color: '#fff'}} itemStyle={{color: '#D4AF37'}}/><Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#goldGrad)" /></AreaChart></ResponsiveContainer>
                  </div>
                </div>
             </div>

            {/* YOUTUBE VIDEOS (ĐÃ BỎ AUTO SCROLL, CHUYỂN VỀ GRID) */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-4">Latest Videos</h3>
              {loadingVideos ? (<div className="flex justify-center py-12 text-gray-500"><Loader2 className="animate-spin" size={32}/></div>) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <a href={video.link} target="_blank" key={video.id} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-sm hover:border-pmc-gold/50 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={video.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={48} className="fill-white text-white drop-shadow-xl" /></div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-white font-bold line-clamp-2 mb-3 group-hover:text-pmc-gold transition text-lg leading-tight h-[3.5rem]">{video.title}</h4>
                        <div className="flex justify-between text-xs text-gray-400 font-mono border-t border-zinc-800 pt-3">
                          <span className="flex items-center gap-1 hover:text-white"><Users size={14}/> {video.views}</span>
                          <span className="flex items-center gap-1 hover:text-white"><ThumbsUp size={14}/> {video.likes}</span>
                          <span className="flex items-center gap-1 hover:text-white"><MessageCircle size={14}/> {video.comments}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* SPOTIFY */}
            <div className="bg-gradient-to-b from-zinc-800 to-black rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative border border-zinc-800">
               <div className="absolute top-0 right-0 p-32 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 relative z-10">
                <div className="flex items-center gap-6">
                  <img src="https://vmasgroup.com/wp-content/uploads/2024/05/VU-TRU-CO-BAY.png" className="w-24 h-24 md:w-32 md:h-32 shadow-2xl rounded-lg" alt="Album Art" />
                  <div>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1 block">Spotify Verified</span>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 tracking-tight">PHƯƠNG MỸ CHI</h2>
                    <p className="text-gray-400 text-sm font-bold">461,646 monthly listeners</p>
                  </div>
                </div>
                <a href={SOCIAL_LINKS.spotify} target="_blank" className="bg-[#1DB954] text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"><Play fill="black" size={20}/> FOLLOW</a>
              </div>
              <div className="space-y-1 relative z-10">
                {SPOTIFY_DATA.map((track, idx) => (
                  <a key={track.id} href={track.link} target="_blank" className="group flex items-center py-3 px-4 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <span className="w-8 text-gray-500 group-hover:text-[#1DB954] font-mono">{idx + 1}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold group-hover:text-[#1DB954] transition">{track.title}</p>
                      <p className="text-gray-400 text-xs">{track.artists}</p>
                    </div>
                    <span className="text-gray-500 text-sm font-mono">{track.duration}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-pmc-gold selection:text-black">
      
      {/* --- HEADER NAVIGATION (STICKY TOP) --- */}
      {/* Hiệu ứng: Chuyển từ trong suốt sang đen mờ khi cuộn */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4 shadow-2xl border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border rounded-full flex items-center justify-center text-xs font-serif font-bold transition-colors ${isScrolled ? 'border-pmc-gold text-pmc-gold' : 'border-white text-white'}`}>PMC</div>
            <span className={`text-sm font-serif tracking-widest hidden md:block transition-colors ${isScrolled ? 'text-white' : 'text-gray-300'}`}>PHƯƠNG MỸ CHI</span>
          </div>
          
          {/* FUNCTIONAL TABS (Đưa lên giữa) */}
          <div className="hidden md:flex items-center gap-1 bg-black/20 backdrop-blur-sm p-1 rounded-full border border-white/5">
            {[
              {id: 'home', label: 'Trang Chủ'}, 
              {id: 'about', label: 'Giới Thiệu'}, 
              {id: 'streaming', label: 'Streaming Guide'},
              {id: 'schedule', label: 'Lịch Trình'}, 
              {id: 'stats', label: 'Thống Kê'}
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => { setActiveTab(tab.id); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id ? 'bg-pmc-gold text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Button phụ */}
          <button className={`px-5 py-2 border text-xs font-bold tracking-widest rounded-full transition uppercase ${isScrolled ? 'border-pmc-gold text-pmc-gold hover:bg-pmc-gold hover:text-black' : 'border-white text-white hover:bg-white hover:text-black'}`}>
            Listen now
          </button>
        </div>

        {/* Mobile Nav (Hiển thị đơn giản cho mobile) */}
        <div className="md:hidden flex overflow-x-auto gap-4 px-4 mt-4 pb-2 scrollbar-hide">
             {[
              {id: 'home', label: 'Trang Chủ'}, 
              {id: 'about', label: 'Giới Thiệu'}, 
              {id: 'streaming', label: 'Streaming'},
              {id: 'schedule', label: 'Lịch Trình'}, 
              {id: 'stats', label: 'Thống Kê'}
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`whitespace-nowrap px-3 py-1 text-xs font-bold uppercase border-b-2 ${activeTab === tab.id ? 'border-pmc-gold text-pmc-gold' : 'border-transparent text-gray-500'}`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://image.phunuonline.com.vn/fckeditor/upload/2023/20230420/images/tphcm-to-chuc-ban-phao-hoa-_871681988662.jpeg" 
            className="w-full h-full object-cover opacity-90 scale-105 animate-slow-zoom" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in-up mt-10">
          
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-gray-400">
          <ChevronDown size={32} />
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {renderContent()}
      </div>
      
      <footer className="border-t border-zinc-800 bg-black py-12 text-center">
        <h2 className="font-bold text-xl    -pmc-gold mb-2">© 2026 Phương Mỹ Chi Fan Hub</h2>
        <p className="text-gray-600 text-sm">Developed by NhihnhanhinhocungMyChi</p>
      </footer>
    </main>
  );
}