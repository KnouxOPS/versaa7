export default function MyComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center text-3xl font-bold animate-pulse">
              K
            </div>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            KNOUX VERSA
          </h1>

          <h2 className="text-3xl font-semibold text-yellow-400">
            🚀 النظام المحلي الكامل للذكاء الاصطناعي
          </h2>
        </div>

        {/* Description */}
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          30 أداة ذكاء اصطناعي متقدمة تعمل بالكامل على جهازك - بدون إنترنت، بدون
          رفع بيانات، خصوصية مطلقة
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">100% محلي وآمن</h3>
            <p className="text-gray-300 text-sm">جميع العمليات تتم على جهازك</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">30 أداة ذكاء اصطناعي</h3>
            <p className="text-gray-300 text-sm">مجموعة شاملة من الأدوات</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">معالجة فورية</h3>
            <p className="text-gray-300 text-sm">نتائج سريعة بدون انتظار</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">حرية كاملة</h3>
            <p className="text-gray-300 text-sm">بدون قيود أو رقابة</p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F097d5f110a6844f7bf48358cc02a3156%2F4089c5496d87402ab56438165795fedb?format=webp&width=800"
            alt="KNOUX VERSA Interface"
            className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Call to Action */}
        <div className="mt-16 space-y-6">
          <h3 className="text-3xl font-bold text-white">جاهز للبدء؟</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              🚀 ابدأ الآن مجاناً
            </button>
            <button className="border border-purple-400/50 hover:bg-purple-400/10 text-white px-8 py-4 text-lg rounded-full transition-all duration-300">
              📺 شاهد العرض التوضيحي
            </button>
          </div>

          <div className="text-sm text-gray-400 space-y-2 mt-8">
            <p>✨ مجاني تماماً - بدون اشتراكات</p>
            <p>🔒 خصوصية مطلقة - بياناتك آمنة</p>
            <p>🚀 بدء فوري - لا يحتاج تسجيل</p>
          </div>
        </div>

        {/* Success Quote */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8">
          <p className="text-yellow-400 font-bold text-lg mb-2">
            🔥 كلمة السر للنجاح
          </p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            "حرية بلا حدود مع KnouxAI"
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400">
          <p>
            تم التطوير بإبداع بواسطة{" "}
            <span className="text-cyan-400 font-bold">Sadek Elgazar</span> | ©
            2025 KNOUX VERSA
          </p>
          <p className="text-sm mt-2">
            ادعم المطور على{" "}
            <a
              href="https://buymeacoffee.com/knoux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              BuyMeACoffee
            </a>{" "}
            ✨
          </p>
        </div>
      </div>
    </div>
  );
}
