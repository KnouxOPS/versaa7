export default function SimpleBuilderComponent() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
        color: "white",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #00ffff, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            fontSize: "2rem",
            fontWeight: "bold",
            animation: "pulse 2s infinite",
          }}
        >
          K
        </div>

        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #00ffff, #8b5cf6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            margin: "0 0 1rem 0",
          }}
        >
          KNOUX VERSA
        </h1>

        <h2
          style={{
            fontSize: "1.5rem",
            color: "#fbbf24",
            margin: "0 0 1rem 0",
          }}
        >
          🚀 النظام المحلي الكامل للذكاء الاصطناعي
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#d1d5db",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          30 أداة ذكاء اصطناعي متقدمة تعمل بالكامل على جهازك - بدون إنترنت، بدون
          رفع بيانات، خصوصية مطلقة
        </p>
      </div>

      {/* Features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "1rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
              color: "#00ffff",
            }}
          >
            100% محلي وآمن
          </h3>
          <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
            جميع العمليات تتم على جهازك
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "1rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
              color: "#8b5cf6",
            }}
          >
            30 أداة ذكاء اصطناعي
          </h3>
          <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
            مجموعة شاملة من الأدوات
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "1rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
              color: "#10b981",
            }}
          >
            معالجة فورية
          </h3>
          <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
            نتائج سريعة بدون انتظار
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "1rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎨</div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
              color: "#f59e0b",
            }}
          >
            حرية كاملة
          </h3>
          <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
            بدون قيود أو رقابة
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          textAlign: "center",
          background: "rgba(139, 92, 246, 0.1)",
          padding: "2rem",
          borderRadius: "1rem",
          border: "1px solid rgba(139, 92, 246, 0.3)",
        }}
      >
        <h3 style={{ fontSize: "2rem", marginBottom: "1rem", color: "white" }}>
          جاهز للبدء؟
        </h3>
        <p style={{ color: "#d1d5db", marginBottom: "1.5rem" }}>
          انضم إلى آلاف المستخدمين الذين يستمتعون بالحرية الكاملة في الإبداع
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              background: "linear-gradient(45deg, #00ffff, #8b5cf6)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "2rem",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
          >
            🚀 ابدأ الآن مجاناً
          </button>

          <button
            style={{
              background: "transparent",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "2rem",
              border: "2px solid rgba(139, 92, 246, 0.5)",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            📺 شاهد العرض التوضيحي
          </button>
        </div>

        <div
          style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#9ca3af" }}
        >
          <p>✨ مجاني تماماً - بدون اشتراكات</p>
          <p>🔒 خصوصية مطلقة - بياناتك آمنة</p>
          <p>🚀 بدء فوري - لا يحتاج تسجيل</p>
        </div>
      </div>

      {/* Success Quote */}
      <div
        style={{
          textAlign: "center",
          marginTop: "3rem",
          background:
            "linear-gradient(45deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))",
          padding: "2rem",
          borderRadius: "1rem",
          border: "1px solid rgba(251, 191, 36, 0.3)",
        }}
      >
        <p
          style={{
            color: "#fbbf24",
            fontWeight: "bold",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
          }}
        >
          🔥 كلمة السر للنجاح
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #00ffff, #8b5cf6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          "حرية بلا حدود مع KnouxAI"
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "3rem", color: "#9ca3af" }}>
        <p>
          تم التطوير بإبداع بواسطة{" "}
          <span style={{ color: "#00ffff", fontWeight: "bold" }}>
            Sadek Elgazar
          </span>{" "}
          | © 2025 KNOUX VERSA
        </p>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          ادعم المطور على{" "}
          <a
            href="https://buymeacoffee.com/knoux"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fbbf24", textDecoration: "none" }}
          >
            BuyMeACoffee
          </a>{" "}
          ✨
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
