const OpenAI = require('openai');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the AI assistant
const SYSTEM_PROMPT = `Siz HealthJourney platformunun AI sağlık turizmi danışmanısınız.

GÖREVİNİZ:
- Kullanıcılara sağlık turizmi paketleri bulmada yardımcı olmak
- Paket rezervasyonu yapmalarına yardım etmek
- Bütçe, lokasyon, tarih ve hizmet tercihlerine göre öneriler sunmak
- Tüm platform özelliklerini konuşma yoluyla erişilebilir kılmak

KURALLAR:
- Her zaman Türkçe konuşun (kullanıcı İngilizce yazmadıkça)
- Samimi ve yardımsever olun
- Kısa ve net yanıtlar verin (maksimum 3-4 cümle)
- Paket önerirken nedenleri açıklayın
- Fiyatları her zaman doğru belirtin
- Kullanıcı bilgilerini gizli tutun

REZERVASYON AKIŞI (ÇOK ÖNEMLİ):

ADIM 1 - Bilgi Toplama:
Rezervasyon için GEREKLİ bilgiler:
- Paket adı veya kategori (örn: "Bodrum Luxury Wellness & Spa" veya "saç ekimi paketi")
- Tarih (örn: "1 Haziran 2026")
- Kişi sayısı (örn: "4 kişi")

Eğer kullanıcı bu bilgilerin HERHANGİ BİRİNİ vermemişse:
- searchPackages ile paketleri gösterin
- Eksik bilgileri SORUN (tarih? kaç kişi?)
- ASLA varsayımda bulunmayın

ADIM 2 - Onay Alma:
Tüm bilgiler toplandıktan sonra:
- Kullanıcıya özet gösterin (paket, tarih, kişi sayısı, fiyat)
- "Rezervasyonu onaylıyor musunuz?" diye SORUN
- Kullanıcı onayladıktan SONRA createBooking çağırın

ADIM 3 - Rezervasyon:
Sadece kullanıcı NET ONAY verdiğinde (örn: "evet", "onayla", "rezerve et"):
1. searchPackages ile güncel paket ID'sini alın
2. createBooking ile rezervasyonu oluşturun
3. Başarı mesajını gösterin

ASLA eksik bilgi ile veya onay almadan rezervasyon yapmayın!

İPTAL AKIŞI (ÇOK ÖNEMLİ):

ADIM 1 - Rezervasyon Belirleme:
Kullanıcı rezervasyon iptal etmek istediğinde:
- Hangi rezervasyonu iptal etmek istediğini SORUN
- getUserBookings ile rezervasyonları gösterebilirsiniz
- Rezervasyon numarası (örn: HT202501003) veya açıklama istersiniz

ADIM 2 - Bilgilendirme ve Onay:
Rezervasyon belirlendikten sonra:
- İptal politikasını bildirin (kaç gün kaldığına göre iade yüzdesi)
- İade miktarını gösterin
- "Bu rezervasyonu iptal etmek istediğinizden emin misiniz?" diye SORUN

ADIM 3 - İptal İşlemi:
Sadece kullanıcı NET ONAY verdiğinde (örn: "evet", "iptal et", "eminim"):
- cancelBooking fonksiyonunu çağırın
- İptal detaylarını gösterin (iade miktarı, iptal tarihi)

ASLA onay almadan rezervasyon iptal etmeyin!

ÖNEMLİ:
- Function calling ile paket bilgilerini gerçek veritabanından alın
- Asla yalan veya uydurma bilgi vermeyin
- Emin olmadığınız konularda "Bunu bir müşteri temsilcisi ile konuşmanızı öneririm" deyin
- REZERVASYON YAPARKEN: searchPackages fonksiyonundan dönen paket ID'sini AYNEN kullanın (örnek: "694173d0ba38c348223cf172")
- Paket ismini veya başka bir string'i packageId olarak GÖNDERMEYİN
- Eğer "Bu paket ID'si artık geçerli değil" hatası alırsanız, HEMEN searchPackages ile yeni arama yapın ve YENİ ID'yi kullanın`;

// Function definitions for OpenAI
const functions = [
  {
    name: 'searchPackages',
    description: 'Search for health tourism packages based on filters like category, price range, location, and duration',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Package category (e.g., wellness-spa, dental-care, hair-transplant, cosmetic-surgery)',
          enum: ['wellness-spa', 'dental-care', 'hair-transplant', 'health-checkup', 'cosmetic-surgery', 'eye-surgery', 'orthopedic', 'cardiology']
        },
        minPrice: {
          type: 'number',
          description: 'Minimum price in euros'
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price in euros'
        },
        location: {
          type: 'string',
          description: 'City or country name'
        },
        minDuration: {
          type: 'number',
          description: 'Minimum duration in days'
        },
        maxDuration: {
          type: 'number',
          description: 'Maximum duration in days'
        }
      }
    }
  },
  {
    name: 'getPackageDetails',
    description: 'Get detailed information about a specific package by ID',
    parameters: {
      type: 'object',
      properties: {
        packageId: {
          type: 'string',
          description: 'The MongoDB ObjectId of the package'
        }
      },
      required: ['packageId']
    }
  },
  {
    name: 'getUserBookings',
    description: 'Get all bookings for the current user',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'createBooking',
    description: 'Create a new booking for a package. User must be logged in. IMPORTANT: Use the exact "id" field from searchPackages result (24-character hex string), NOT the package title or any other string.',
    parameters: {
      type: 'object',
      properties: {
        packageId: {
          type: 'string',
          description: 'The exact MongoDB ObjectId from searchPackages result (example: "694173d0ba38c348223cf172"). NEVER use package title or any other format.'
        },
        startDate: {
          type: 'string',
          description: 'Start date of the trip in YYYY-MM-DD format'
        },
        numberOfPeople: {
          type: 'number',
          description: 'Number of people for the booking (default: 1)'
        },
        specialRequests: {
          type: 'string',
          description: 'Any special requests or notes for the booking'
        }
      },
      required: ['packageId', 'startDate']
    }
  },
  {
    name: 'cancelBooking',
    description: 'Cancel an existing booking. User must be logged in and the booking must belong to them. Only bookings with status "payment-pending" or "confirmed" can be cancelled.',
    parameters: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'string',
          description: 'The MongoDB ObjectId of the booking to cancel, OR the booking number (e.g., "HT202501003")'
        }
      },
      required: ['bookingId']
    }
  }
];

// Helper function to normalize Turkish characters for search
function normalizeTurkish(text) {
  if (!text) return '';
  return text
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c');
}

// Function to search packages
async function searchPackages(filters) {
  try {
    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query['pricing.basePrice'] = {};
      if (filters.minPrice !== undefined) {
        query['pricing.basePrice'].$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query['pricing.basePrice'].$lte = filters.maxPrice;
      }
    }

    if (filters.location) {
      // Normalize location for Turkish character support
      const normalizedLocation = normalizeTurkish(filters.location);
      query.$or = [
        { 'location.city': { $regex: normalizedLocation, $options: 'i' } },
        { 'location.country': { $regex: normalizedLocation, $options: 'i' } }
      ];
    }

    if (filters.minDuration !== undefined || filters.maxDuration !== undefined) {
      query['duration.days'] = {};
      if (filters.minDuration !== undefined) {
        query['duration.days'].$gte = filters.minDuration;
      }
      if (filters.maxDuration !== undefined) {
        query['duration.days'].$lte = filters.maxDuration;
      }
    }

    const packages = await Package.find(query)
      .limit(10)
      .select('title category location pricing duration rating description')
      .lean();

    return {
      success: true,
      count: packages.length,
      packages: packages.map(pkg => ({
        id: pkg._id,
        title: pkg.title,
        category: pkg.category,
        location: `${pkg.location.city}, ${pkg.location.country}`,
        price: pkg.pricing.basePrice,
        currency: pkg.pricing.currency,
        duration: pkg.duration.days,
        rating: pkg.rating.average,
        description: pkg.description.substring(0, 200)
      }))
    };
  } catch (error) {
    console.error('Error searching packages:', error);
    return {
      success: false,
      error: 'Paket arama sırasında bir hata oluştu'
    };
  }
}

// Function to get package details
async function getPackageDetails(packageId) {
  try {
    const packageData = await Package.findById(packageId).lean();

    if (!packageData) {
      return {
        success: false,
        error: 'Paket bulunamadı'
      };
    }

    return {
      success: true,
      package: {
        id: packageData._id,
        title: packageData.title,
        category: packageData.category,
        description: packageData.description,
        location: packageData.location,
        duration: packageData.duration,
        pricing: packageData.pricing,
        inclusions: packageData.inclusions,
        exclusions: packageData.exclusions,
        itinerary: packageData.itinerary,
        rating: packageData.rating,
        available: packageData.isActive
      }
    };
  } catch (error) {
    console.error('Error getting package details:', error);
    return {
      success: false,
      error: 'Paket detayları alınırken bir hata oluştu'
    };
  }
}

// Function to get user bookings
async function getUserBookings(userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'Rezervasyonları görmek için giriş yapmanız gerekiyor'
      };
    }

    const bookings = await Booking.find({ user: userId })
      .populate('package', 'title location pricing')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      success: true,
      count: bookings.length,
      bookings: bookings.map(booking => ({
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        packageTitle: booking.package?.title,
        location: booking.package?.location,
        status: booking.status,
        startDate: booking.travelDates?.startDate,
        totalPrice: booking.pricing?.totalPrice,
        currency: booking.pricing?.currency,
        bookingDate: booking.createdAt
      }))
    };
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return {
      success: false,
      error: 'Rezervasyonlar alınırken bir hata oluştu'
    };
  }
}

// Function to create a booking
async function createBooking(bookingData, userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'Rezervasyon yapmak için giriş yapmanız gerekiyor'
      };
    }

    // Get user data
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      };
    }

    // Find package by ID or title (AI might send title instead of ID)
    let packageData;

    // Try to find by ID first (if it's a valid ObjectId)
    if (bookingData.packageId.match(/^[0-9a-fA-F]{24}$/)) {
      packageData = await Package.findById(bookingData.packageId);

      // If ObjectId format is correct but package not found, it might be from an old database session
      // Return a helpful error message asking AI to search again
      if (!packageData) {
        return {
          success: false,
          error: 'Bu paket ID\'si artık geçerli değil. Lütfen önce paket araması yapın ve güncel ID\'yi kullanın.',
          requiresNewSearch: true
        };
      }
    }

    // If not found or not a valid ObjectId, try to find by title
    // Support multiple formats: "Bodrum Luxury Wellness & Spa", "bodrum-luxury-wellness-spa", "Bodrum_Luxury_Wellness_Spa"
    if (!packageData) {
      // Convert kebab-case or underscore to spaces and search
      // Create a flexible regex that ignores special characters like &, -, _
      const searchTerm = bookingData.packageId
        .replace(/[-_]/g, ' ')           // Replace dashes and underscores with spaces
        .replace(/\s+/g, '\\s*[&\\s]*'); // Allow spaces and & between words

      packageData = await Package.findOne({
        title: { $regex: new RegExp(searchTerm, 'i') }
      });
    }

    if (!packageData) {
      return {
        success: false,
        error: `Paket bulunamadı: ${bookingData.packageId}. Lütfen önce paket araması yapın.`,
        requiresNewSearch: true
      };
    }

    if (!packageData.isActive) {
      return {
        success: false,
        error: 'Bu paket şu anda aktif değil'
      };
    }

    // Calculate dates
    const startDate = new Date(bookingData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    // Validate that start date is not in the past
    if (startDate < today) {
      return {
        success: false,
        error: 'Geçmiş tarihe rezervasyon yapılamaz. Lütfen bugünden sonraki bir tarih seçin.'
      };
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + packageData.duration.days);

    // Calculate total price
    const numberOfPeople = bookingData.numberOfPeople || 1;
    const basePrice = packageData.pricing.basePrice;
    const totalPrice = basePrice * numberOfPeople;

    // Generate booking number
    const bookingNumber = `HT${Date.now()}`;

    // Create booking with all required fields
    console.log('📝 Creating booking with data:', {
      userId,
      packageId: packageData._id,
      startDate,
      endDate,
      numberOfPeople,
      totalPrice
    });

    const booking = await Booking.create({
      user: userId,
      package: packageData._id,
      bookingNumber,
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '+90 000 000 0000',
        country: user.country || 'Turkey',
        dateOfBirth: user.dateOfBirth || new Date('1990-01-01')
      },
      travelDates: {
        startDate: startDate,
        endDate: endDate,
        flexibility: 'exact'
      },
      travelers: {
        adults: numberOfPeople,
        children: 0,
        infants: 0
      },
      pricing: {
        basePrice: basePrice,
        additionalServices: 0,
        discounts: 0,
        taxes: 0,
        totalPrice: totalPrice,
        currency: packageData.pricing.currency || 'EUR',
        paymentPlan: 'deposit-balance'
      },
      payment: {
        status: 'pending'
      },
      status: 'payment-pending',
      accommodation: {
        specialRequests: bookingData.specialRequests || ''
      }
    });

    console.log('✅ Booking created successfully:', {
      id: booking._id,
      bookingNumber: booking.bookingNumber,
      status: booking.status
    });

    return {
      success: true,
      message: 'Rezervasyonunuz başarıyla oluşturuldu!',
      booking: {
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        packageTitle: packageData.title,
        startDate: booking.travelDates.startDate,
        numberOfPeople: numberOfPeople,
        totalPrice: booking.pricing.totalPrice,
        currency: booking.pricing.currency,
        status: booking.status
      }
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: 'Rezervasyon oluşturulurken bir hata oluştu: ' + error.message
    };
  }
}

// Function to cancel a booking
async function cancelBooking(bookingData, userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'Rezervasyon iptal etmek için giriş yapmanız gerekiyor'
      };
    }

    const { bookingId } = bookingData;

    console.log('🔍 Attempting to cancel booking:', {
      bookingId,
      userId,
      isObjectId: bookingId.match(/^[0-9a-fA-F]{24}$/)
    });

    // Find booking by ObjectId or booking number
    let booking;

    // Try to find by ObjectId first
    if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(bookingId).populate('package', 'title');
      console.log('📝 Searched by ObjectId, found:', booking ? 'YES' : 'NO');
    } else {
      // Try to find by booking number (e.g., HT202501003)
      booking = await Booking.findOne({ bookingNumber: bookingId }).populate('package', 'title');
      console.log('📝 Searched by booking number, found:', booking ? 'YES' : 'NO');
    }

    if (!booking) {
      console.log('❌ Booking not found');
      return {
        success: false,
        error: `Rezervasyon bulunamadı: ${bookingId}`
      };
    }

    console.log('📋 Found booking:', {
      id: booking._id,
      bookingNumber: booking.bookingNumber,
      bookingUserId: booking.user.toString(),
      requestUserId: userId,
      match: booking.user.toString() === userId
    });

    // Check if booking belongs to the user
    if (booking.user.toString() !== userId.toString()) {
      console.log('❌ Booking does not belong to user');
      return {
        success: false,
        error: 'Bu rezervasyon size ait değil. Sadece kendi rezervasyonlarınızı iptal edebilirsiniz.'
      };
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return {
        success: false,
        error: 'Bu rezervasyon zaten iptal edilmiş.'
      };
    }

    // Check if booking is already completed
    if (booking.status === 'completed') {
      return {
        success: false,
        error: 'Tamamlanmış rezervasyonlar iptal edilemez. Lütfen müşteri hizmetleri ile iletişime geçin.'
      };
    }

    // Check if start date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(booking.travelDates.startDate);

    if (startDate < today) {
      return {
        success: false,
        error: 'Başlangıç tarihi geçmiş rezervasyonlar iptal edilemez. Lütfen müşteri hizmetleri ile iletişime geçin.'
      };
    }

    // Calculate refund amount based on cancellation policy
    // Simple policy:
    // - More than 30 days before: 100% refund
    // - 15-30 days before: 50% refund
    // - Less than 15 days: No refund
    const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    let refundPercentage = 0;
    let refundAmount = 0;

    if (daysUntilStart > 30) {
      refundPercentage = 100;
    } else if (daysUntilStart >= 15) {
      refundPercentage = 50;
    } else {
      refundPercentage = 0;
    }

    refundAmount = (booking.pricing.totalPrice * refundPercentage) / 100;

    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledAt: new Date(),
      reason: 'Kullanıcı tarafından iptal edildi',
      refundAmount: refundAmount,
      refundPercentage: refundPercentage
    };

    await booking.save();

    return {
      success: true,
      message: 'Rezervasyonunuz başarıyla iptal edildi.',
      cancellation: {
        bookingNumber: booking.bookingNumber,
        packageTitle: booking.package?.title,
        cancelledAt: booking.cancellation.cancelledAt,
        refundAmount: refundAmount,
        refundPercentage: refundPercentage,
        currency: booking.pricing.currency,
        originalAmount: booking.pricing.totalPrice
      }
    };

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      error: 'Rezervasyon iptal edilirken bir hata oluştu: ' + error.message
    };
  }
}

// Execute function based on function call
async function executeFunctionCall(functionName, args, userId) {
  switch (functionName) {
    case 'searchPackages':
      return await searchPackages(args);

    case 'getPackageDetails':
      return await getPackageDetails(args.packageId);

    case 'getUserBookings':
      return await getUserBookings(userId);

    case 'createBooking':
      return await createBooking(args, userId);

    case 'cancelBooking':
      return await cancelBooking(args, userId);

    default:
      return {
        success: false,
        error: 'Bilinmeyen fonksiyon'
      };
  }
}

// Main chat function
async function chat(userMessage, conversationHistory = [], userId = null) {
  try {
    // Build messages array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    let functionsCalled = [];
    let lastFunctionResult = null;
    const maxIterations = 5; // Prevent infinite loops
    let iterations = 0;

    // Loop to handle multiple function calls in sequence
    while (iterations < maxIterations) {
      iterations++;

      // API call
      let response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        functions: functions,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 500
      });

      let assistantMessage = response.choices[0].message;

      // Check if function call was made
      if (assistantMessage.function_call) {
        const functionName = assistantMessage.function_call.name;
        const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

        console.log(`Function called (iteration ${iterations}):`, functionName, 'with args:', functionArgs);

        // Execute the function
        const functionResult = await executeFunctionCall(functionName, functionArgs, userId);

        // Track function calls
        functionsCalled.push({
          name: functionName,
          args: functionArgs,
          result: functionResult
        });
        lastFunctionResult = functionResult;

        // Add function call and result to messages
        messages.push(assistantMessage);
        messages.push({
          role: 'function',
          name: functionName,
          content: JSON.stringify(functionResult)
        });

        // Continue loop to check if AI wants to call another function
        continue;
      }

      // No more function calls, return final response
      return {
        success: true,
        message: assistantMessage.content,
        functionsCalled: functionsCalled.length > 0 ? functionsCalled : undefined,
        functionCalled: functionsCalled.length > 0 ? functionsCalled[functionsCalled.length - 1].name : undefined,
        functionResult: lastFunctionResult,
        usage: response.usage
      };
    }

    // Max iterations reached
    return {
      success: false,
      error: 'Çok fazla işlem yapıldı. Lütfen tekrar deneyin.',
      message: 'Üzgünüm, işlem çok uzun sürdü. Lütfen daha basit bir şekilde tekrar deneyin.'
    };

  } catch (error) {
    console.error('AI Chat Error:', error);

    // Check for specific OpenAI errors
    if (error.code === 'invalid_api_key') {
      return {
        success: false,
        error: 'OpenAI API key geçersiz. Lütfen yönetici ile iletişime geçin.'
      };
    }

    if (error.code === 'rate_limit_exceeded') {
      return {
        success: false,
        error: 'Çok fazla istek yapıldı. Lütfen biraz bekleyip tekrar deneyin.'
      };
    }

    return {
      success: false,
      error: 'AI ile iletişimde bir sorun oluştu. Lütfen tekrar deneyin.',
      details: error.message
    };
  }
}

// Get quick suggestions
function getQuickSuggestions() {
  return [
    'Bütçeme uygun paketleri göster',
    'Diş tedavisi paketleri',
    'Termal spa ve wellness',
    'Saç ekimi paketleri',
    'Rezervasyonlarımı göster',
    'İstanbul\'da hangi paketler var?',
    'En popüler paketler neler?'
  ];
}

module.exports = {
  chat,
  getQuickSuggestions,
  searchPackages,
  getPackageDetails,
  getUserBookings
};
