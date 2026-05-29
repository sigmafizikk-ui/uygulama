import { Announcement, ShareItem, Neighbor, FaultReport, Event, Document } from '@/types';

// Site structure with multiple apartments
export const siteInfo = {
  name: 'Güneş Sitesi',
  address: 'Mahalle: Yıldız Mahallesi, Kadıköy/İstanbul',
  totalBlocks: 4,
  totalApartments: 120,
  management: {
    president: 'Ahmet Yılmaz',
    phone: '0532 111 22 33',
    email: 'yonetim@gunessitesi.com',
  },
};

export const blocks = [
  { id: 'A', name: 'A Blok', apartments: 30, floors: 5 },
  { id: 'B', name: 'B Blok', apartments: 30, floors: 5 },
  { id: 'C', name: 'C Blok', apartments: 30, floors: 5 },
  { id: 'D', name: 'D Blok', apartments: 30, floors: 5 },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Site Genel Kurul Toplantısı',
    content: 'Pazar günü saat 10:00\'da site sosyal tesislerinde olağan genel kurul toplantısı yapılacaktır. Tüm blok temsilcilerinin katılımı zorunludur. Gündem: 2026 bütçesi ve ortak alan tadilatı.',
    priority: 'urgent',
    author: 'Site Yönetimi',
    createdAt: new Date('2026-05-29T14:20:00'),
  },
  {
    id: '2',
    title: 'A Blok Asansör Bakımı',
    content: 'Cumartesi günü saat 10:00 - 12:00 arasında A Blok asansör bakımı yapılacaktır. Lütfen bu saatler arasında asansörü kullanmayınız.',
    priority: 'warning',
    author: 'A Blok Yönetici Ahmet',
    createdAt: new Date('2026-05-29T10:15:00'),
  },
  {
    id: '3',
    title: 'Site Çocuk Parkı Yenilenmesi',
    content: 'Site çocuk parkı için yeni oyun grupları alındı. Salı günü montaj yapılacak, çocuklarımızın oynaması için Perşembe gününden itibaren hazır olacak.',
    priority: 'info',
    author: 'Site Yönetimi',
    createdAt: new Date('2026-05-28T16:45:00'),
  },
  {
    id: '4',
    title: 'Aidat Ödeme Hatırlatması',
    content: 'Mayıs ayı aidat ödemelerinin son tarihi 5 Haziran\'dır. Site aidatları: A Blok 800 TL, B Blok 750 TL, C Blok 850 TL, D Blok 700 TL.',
    priority: 'info',
    author: 'Site Yönetimi',
    createdAt: new Date('2026-05-27T09:00:00'),
  },
];

export const mockShareItems: ShareItem[] = [
  {
    id: '1',
    type: 'borrowing',
    title: 'Ödünç Matkap Aranıyor',
    description: 'Duvara raf asmak için bu akşamlık matkaba ihtiyacım var. İşi bitince hemen teslim ederim.',
    owner: 'Mehmet',
    floor: 3,
    createdAt: new Date('2026-05-29T11:00:00'),
  },
  {
    id: '2',
    type: 'sharing',
    title: 'Merdiven Paylaşımı',
    description: 'Evde işi biten 3 basamaklı alüminyum merdiven var. İhtiyacı olan komşular kullanabilir.',
    owner: 'Ayşe',
    floor: 2,
    createdAt: new Date('2026-05-28T15:30:00'),
  },
  {
    id: '3',
    type: 'borrowing',
    title: 'Tornavida Seti Lazım',
    description: 'Bazı mobilyaları sökmek için tornavida setine ihtiyacım var. 1-2 saatlik iş.',
    owner: 'Ali',
    floor: 4,
    createdAt: new Date('2026-05-27T18:00:00'),
  },
  {
    id: '4',
    type: 'sharing',
    title: 'Yemek Fazlası',
    description: 'Misafir için fazla yapılan yemekten kalan var. İsteyen komşularımız alabilir.',
    owner: 'Fatma',
    floor: 1,
    createdAt: new Date('2026-05-29T13:00:00'),
  },
];

export const mockNeighbors: Neighbor[] = [
  { id: '1', name: 'Ahmet', surname: 'Yılmaz', apartment: 'Daire 1', floor: 1 },
  { id: '2', name: 'Fatma', surname: 'Demir', apartment: 'Daire 2', floor: 1 },
  { id: '3', name: 'Mehmet', surname: 'Kaya', apartment: 'Daire 3', floor: 2 },
  { id: '4', name: 'Ayşe', surname: 'Öztürk', apartment: 'Daire 4', floor: 2 },
  { id: '5', name: 'Ali', surname: 'Arslan', apartment: 'Daire 5', floor: 3 },
  { id: '6', name: 'Zeynep', surname: 'Çelik', apartment: 'Daire 6', floor: 3 },
  { id: '7', name: 'Mustafa', surname: 'Şahin', apartment: 'Daire 7', floor: 4 },
  { id: '8', name: 'Elif', surname: 'Koç', apartment: 'Daire 8', floor: 4 },
  { id: '9', name: 'Emre', surname: 'Kurt', apartment: 'Daire 9', floor: 5 },
  { id: '10', name: 'Seda', surname: 'Aydın', apartment: 'Daire 10', floor: 5 },
];

export const mockFaultReports: FaultReport[] = [
  {
    id: '1',
    title: '2. Kat Koridor Lambası Patlak',
    description: '2. kattaki koridor lambası çalışmıyor. Geçen haftalardır beri böyle.',
    category: 'technical',
    status: 'in_progress',
    reportedBy: 'Mehmet (Daire 3)',
    createdAt: new Date('2026-05-28T10:00:00'),
  },
  {
    id: '2',
    title: 'Bahçe Kapısı Arızalı',
    description: 'Bahçe kapısının kilit mekanizması takılıyor. Düzgün kapanmıyor.',
    category: 'security',
    status: 'pending',
    reportedBy: 'Ayşe (Daire 4)',
    createdAt: new Date('2026-05-29T08:30:00'),
  },
  {
    id: '3',
    title: 'Bodrum Temizliği Gerekli',
    description: 'Bodrum katında temizlik yapılmadı uzun süredir. Toz ve kir birikti.',
    category: 'cleaning',
    status: 'resolved',
    reportedBy: 'Ali (Daire 5)',
    createdAt: new Date('2026-05-25T14:00:00'),
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Olağan Seçimli Genel Kurul',
    description: 'Yıllık olağan genel kurul toplantısı. Yönetim kurulu seçimi ve bütçe oylaması yapılacaktır. Çoğunluk sağlanamazsa sonraki hafta yapılacaktır.',
    date: new Date('2026-06-07'),
    time: '11:00',
    location: 'Sığınak Toplantı Salonu',
    attendees: ['1', '3', '5', '7'],
  },
  {
    id: '2',
    title: 'Bahçe Düzenleme Etkinliği',
    description: 'Apartman bahçesine çiçek dikimi ve genel temizlik. Katılanlara ikram olunacaktır.',
    date: new Date('2026-06-14'),
    time: '10:00',
    location: 'Apartman Bahçesi',
    attendees: ['2', '4', '6', '8'],
  },
  {
    id: '3',
    title: 'Bayram Ziyareti',
    description: 'Kurban Bayramı nedeniyle tüm komşularımızın bayramını kutlamak için ortak kahvaltı organizasyonu.',
    date: new Date('2026-06-17'),
    time: '09:30',
    location: 'Sığınak Toplantı Salonu',
    attendees: ['1', '2', '3', '4', '5'],
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: '2026 Yılı Bina İşletme Projesi.pdf',
    type: 'pdf',
    url: '/documents/2026-isletme-projesi.pdf',
    uploadedAt: new Date('2026-01-15'),
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Mayıs Ayı Gelir Gider Tablosu.pdf',
    type: 'pdf',
    url: '/documents/mayis-2026-gelir-gider.pdf',
    uploadedAt: new Date('2026-05-05'),
    size: '856 KB',
  },
  {
    id: '3',
    name: 'Karar Defteri 2025.pdf',
    type: 'pdf',
    url: '/documents/karar-defteri-2025.pdf',
    uploadedAt: new Date('2026-01-10'),
    size: '1.2 MB',
  },
  {
    id: '4',
    name: 'Yönetim Plânı.pdf',
    type: 'pdf',
    url: '/documents/yonetim-plani.pdf',
    uploadedAt: new Date('2025-12-20'),
    size: '512 KB',
  },
  {
    id: '5',
    name: 'Apartman Kat Mülkiyeti Belgesi.pdf',
    type: 'pdf',
    url: '/documents/kat-mulkiyeti.pdf',
    uploadedAt: new Date('2020-06-01'),
    size: '3.1 MB',
  },
];

export const currentUser = {
  id: '12',
  name: 'Kullanıcı',
  surname: 'Demo',
  apartment: 'Daire 12',
  block: 'A Blok',
  floor: 6,
  email: 'demo@example.com',
};

// Local Businesses (Anlaşmalı Esnaflar)
export interface LocalBusiness {
  id: string;
  name: string;
  category: 'food' | 'grocery' | 'service' | 'health' | 'other';
  description: string;
  discount: string;
  phone: string;
  address: string;
  distance: string;
  rating: number;
  image?: string;
}

export const mockBusinesses: LocalBusiness[] = [
  {
    id: '1',
    name: 'Komşu Market',
    category: 'grocery',
    description: 'Taze sebze, meyve ve günlük ihtiyaçlar. Site sakinlerine özel %10 indirim.',
    discount: '%10 indirim',
    phone: '0532 234 56 78',
    address: 'Yıldız Mah. Cumhuriyet Cad. No:45',
    distance: '150m',
    rating: 4.7,
  },
  {
    id: '2',
    name: 'Ahmet Usta Kuruyemiş',
    category: 'food',
    description: 'Taze kuruyemiş ve çerezler. 1 kg üzeri alışverişlerde %15 indirim.',
    discount: '%15 indirim',
    phone: '0542 345 67 89',
    address: 'Yıldız Mah. Atatürk Cad. No:12',
    distance: '200m',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Temizlik Büyüsü',
    category: 'service',
    description: 'Ev temizliği, kuru temizleme ve ütü hizmeti. Site sakinlerine %20 indirim.',
    discount: '%20 indirim',
    phone: '0533 456 78 90',
    address: 'Yıldız Mah. Gül Sok. No:8',
    distance: '100m',
    rating: 4.5,
  },
  {
    id: '4',
    name: 'Yıldız Eczanesi',
    category: 'health',
    description: '7/24 açık eczane. Site sakinlerine bazı ilaçlarda %5 indirim.',
    discount: '%5 indirim',
    phone: '0216 123 45 67',
    address: 'Yıldız Mah. Hastane Cad. No:1',
    distance: '300m',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Bilgisayar Tamircisi',
    category: 'service',
    description: 'Bilgisayar, telefon tamir ve teknik servis. 1 saat ücretsiz danışmanlık.',
    discount: 'Ücretsiz servIslah',
    phone: '0544 567 89 01',
    address: 'Yıldız Mah. Tekniker Sok. No:3',
    distance: '250m',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Güneş Fırın',
    category: 'food',
    description: 'Taze ekmek ve pastane ürünleri. Her gün 19:00\'dan sonra %30 indirim.',
    discount: '%30 indirim',
    phone: '0216 234 56 78',
    address: 'Yıldız Mah. Fırın Sok. No:5',
    distance: '120m',
    rating: 4.8,
  },
];

// Forum Posts (Sohbet & Soru)
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorBlock: string;
  authorApartment: string;
  category: 'question' | 'discussion' | 'suggestion' | 'complaint';
  replies: ForumReply[];
  likes: number;
  views: number;
  createdAt: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorBlock: string;
  authorApartment: string;
  likes: number;
  createdAt: Date;
}

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Site otopark düzeni hakkında görüşleriniz?',
    content: 'Merhaba komşular, son zamanlarda otoparkta yoğunluk artmaya başladı. Katilere göre park alanı ayrılması konusunda ne düşünüyorsunuz? Sizce adil bir çözüm olabilir mi?',
    author: 'Mehmet Kaya',
    authorId: '3',
    authorBlock: 'A Blok',
    authorApartment: 'Daire 3',
    category: 'discussion',
    replies: [
      {
        id: 'r1',
        content: 'Aynen katılıyorum, bazen gece gelince yer bulmak çok zor oluyor.',
        author: 'Ayşe Demir',
        authorBlock: 'B Blok',
        authorApartment: 'Daire 7',
        likes: 5,
        createdAt: new Date('2026-05-29T12:00:00'),
      },
      {
        id: 'r2',
        content: 'Benzer sıkıntıyı biz de yaşıyoruz. Belki yönetimle konuşabiliriz.',
        author: 'Ali Arslan',
        authorBlock: 'A Blok',
        authorApartment: 'Daire 5',
        likes: 3,
        createdAt: new Date('2026-05-29T14:30:00'),
      },
    ],
    likes: 12,
    views: 89,
    createdAt: new Date('2026-05-29T10:00:00'),
  },
  {
    id: '2',
    title: 'Hangi internet sağlayıcıyı kullanıyorsunuz?',
    content: 'Selam, yeni taşındım. Ev için internet bağlatacağım, bu bölgede hangi sağlayıcı daha iyi çalışıyor? Tavsiyeleriniz var mı?',
    author: 'Zeynep Çelik',
    authorId: '6',
    authorBlock: 'A Blok',
    authorApartment: 'Daire 6',
    category: 'question',
    replies: [
      {
        id: 'r3',
        content: 'Superonline kullanıyorum, hız gayet iyi. Fiyat da uygun.',
        author: 'Mustafa Şahin',
        authorBlock: 'C Blok',
        authorApartment: 'Daire 15',
        likes: 8,
        createdAt: new Date('2026-05-28T16:00:00'),
      },
      {
        id: 'r4',
        content: 'Türk Telekom bizim blokta iyi çalışıyor, pahalı ama hızlı.',
        author: 'Elif Koç',
        authorBlock: 'D Blok',
        authorApartment: 'Daire 22',
        likes: 4,
        createdAt: new Date('2026-05-28T18:00:00'),
      },
    ],
    likes: 7,
    views: 56,
    createdAt: new Date('2026-05-28T14:30:00'),
  },
  {
    id: '3',
    title: 'Çocuklar için ortak oyun saati önerisi',
    content: 'Merhaba, hafta sonları çocuklar için bahçede ortak oyun saati düzenleyelim mi? 10-12 arası gibi. Böylece çocuklar kaynaşır, biz de sohbet ederiz. Ne dersiniz?',
    author: 'Fatma Demir',
    authorId: '2',
    authorBlock: 'A Blok',
    authorApartment: 'Daire 2',
    category: 'suggestion',
    replies: [
      {
        id: 'r5',
        content: 'Harika fikir! Benim de çocuklarım severek gelir.',
        author: 'Seda Aydın',
        authorBlock: 'B Blok',
        authorApartment: 'Daire 10',
        likes: 15,
        createdAt: new Date('2026-05-27T11:00:00'),
      },
    ],
    likes: 25,
    views: 120,
    createdAt: new Date('2026-05-27T09:00:00'),
  },
  {
    id: '4',
    title: 'B Blok asansörü ses yapıyor',
    content: 'B Blok asansörü gece geç saatlerde çok ses yapıyor. Dışarıdaki metal sesi rahatsız edici. Bu konuda yaşayan var mı, siz de duyuyor musunuz?',
    author: 'Ayşe Öztürk',
    authorId: '4',
    authorBlock: 'B Blok',
    authorApartment: 'Daire 4',
    category: 'complaint',
    replies: [],
    likes: 3,
    views: 34,
    createdAt: new Date('2026-05-29T08:00:00'),
  },
];
