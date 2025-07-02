export default function ResearchShowcase() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #00ffff, #8b5cf6, #ec4899)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "1rem",
          }}
        >
          🧠 Knoux-VERSA
        </h1>
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#fbbf24",
            marginBottom: "1rem",
          }}
        >
          نظام متقدم لتحرير الصور المعتمد على الذكاء الاصطناعي
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#d1d5db",
            maxWidth: "1000px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          يمثل <strong style={{ color: "#00ffff" }}>Knoux-VERSA</strong> بنية
          برمجية شاملة موجهة لمعالجة الصور باستخدام تقنيات الذكاء الاصطناعي
          التوليدي عبر نماذج عميقة متعددة الوسائط. صُمّم ليشكل بيئة معيارية ذات
          استقلالية تشغيلية عالية، ويتيح تحكمًا دلاليًا مرنًا في مكونات الصورة.
        </p>
      </div>

      {/* Technical Functions Table */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginBottom: "3rem",
          border: "1px solid rgba(0, 255, 255, 0.2)",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            color: "#00ffff",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          🧠 الوظائف الأساسية: توصيف وظيفي تقني
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              title: "Adaptive Brush Tool",
              description:
                "أداة تحرير تفاعلي ترتكز على توصيف لغوي لإعادة تشكيل المنطقة المحددة بصريًا",
              icon: "🎨",
            },
            {
              title: "Super-Resolution AI",
              description:
                "تعزيز البنية التكسلية للصورة لتصل إلى 4K+ مع الحفاظ على استقرار الملامح",
              icon: "📐",
            },
            {
              title: "Semantic Recoloring",
              description:
                "استبدال الألوان وفق مخطط دلالي يعتمد على التحليل النصي والسياقي للصورة",
              icon: "🌈",
            },
            {
              title: "Generative Backgrounds",
              description:
                "توليد بيئات خلفية تركيبية باستخدام نماذج توليد مشروطة (Conditional GANs)",
              icon: "🏞️",
            },
            {
              title: "Entity Removal & Swap",
              description:
                "تحليل وتمثيل الكيانات لحذفها أو استبدالها بمخرجات مولدة متوافقة دلاليًا",
              icon: "🔄",
            },
            {
              title: "Local Inference Engine",
              description:
                "تنفيذ محلي كامل (offline inference) باستخدام مسرّعات مثل CUDA أو ONNX",
              icon: "⚡",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                padding: "1.5rem",
                borderRadius: "1rem",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {item.icon}
              </div>
              <h4
                style={{
                  color: "#8b5cf6",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Architecture Section */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginBottom: "3rem",
          border: "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            color: "#8b5cf6",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          🔬 بنية الذكاء الاصطناعي وتوزيع المهام النموذجية
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              component: "Prompt Adapter",
              function:
                "يقوم بتحليل الأوامر اللغوية وتحويلها إلى معلمات تشغيل قابلة للتفسير من قبل النموذج",
              color: "#00ffff",
            },
            {
              component: "AutoMask AI Module",
              function:
                "يعتمد على Vision Transformers لتوليد أقنعة دلالية دقيقة للأجسام",
              color: "#8b5cf6",
            },
            {
              component: "Model Loader (Hot-Swap)",
              function:
                "نظام تحميل نماذج في الزمن الحقيقي يدعم ذاكرة ديناميكية وتخصيص الموارد",
              color: "#10b981",
            },
            {
              component: "Prompt Enhancer",
              function:
                "يعيد صياغة الأوامر النصية باستخدام إعادة كتابة شبه دلالية اعتمادًا على BART/LLM",
              color: "#f59e0b",
            },
            {
              component: "IntelliFix Engine",
              function:
                "وحدة تصحيح ذاتي تعتمد على تقنيات Denoising Autoencoders وAnomaly Detection",
              color: "#ec4899",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                padding: "1.5rem",
                borderRadius: "1rem",
                border: `1px solid ${item.color}40`,
              }}
            >
              <h4
                style={{
                  color: item.color,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {item.component}
              </h4>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                }}
              >
                {item.function}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Models Section */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginBottom: "3rem",
          border: "1px solid rgba(16, 185, 129, 0.2)",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            color: "#10b981",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          🧠 النماذج التوليدية المدعومة
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              model: "Stable Diffusion v1.5/2.1",
              usage: "توليد صور واقعية/تجريدية من توصيف نصي",
              source: "Runway / CompVis",
            },
            {
              model: "RealisticVision v5.1",
              usage: "إخراج فائق الواقعية للوجوه",
              source: "HuggingFace",
            },
            {
              model: "Anything V6",
              usage: "إنتاج أنماط رسومية يابانية/أنمي",
              source: "Civitai",
            },
            {
              model: "MODNet / Remove.bg",
              usage: "إزالة خلفيات مع الحفاظ على حواف دقيقة",
              source: "GitHub / Paperspace",
            },
            {
              model: "CLIP + SAM",
              usage: "الربط بين النص والكيانات ال��صرية",
              source: "Meta / OpenAI",
            },
            {
              model: "Prompt-to-Mask Adapter",
              usage: "تحويل الأوامر إلى أقنعة موجهة",
              source: "وحدة داخلية خاصة",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                padding: "1.5rem",
                borderRadius: "1rem",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <h4
                style={{
                  color: "#10b981",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {item.model}
              </h4>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                {item.usage}
              </p>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                المصدر: {item.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div
        style={{
          background:
            "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(6, 255, 165, 0.1))",
          backdropFilter: "blur(10px)",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginBottom: "3rem",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            color: "#10b981",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          🔐 الخصوصية، الأمان، والكفاءة
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛡️</div>
            <h4 style={{ color: "#10b981", marginBottom: "0.5rem" }}>
              التنفيذ محلي 100%
            </h4>
            <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
              غياب أي عمليات إرسال أو تلقي بيانات عبر الشبكة
            </p>
          </div>

          <div>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h4 style={{ color: "#10b981", marginBottom: "0.5rem" }}>
              خصوصية مطلقة
            </h4>
            <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
              عدم تضمين أي بصمات تتبع أو رموز تعريفية داخل ملفات الإخراج
            </p>
          </div>

          <div>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
            <h4 style={{ color: "#10b981", marginBottom: "0.5rem" }}>
              أداء ثابت
            </h4>
            <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
              مصمم لأنظمة بمعمارية متوسطة (8GB RAM, CUDA 11.7)
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "1.5rem",
          padding: "2rem",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            color: "#fbbf24",
            marginBottom: "1.5rem",
          }}
        >
          ✉️ قالب التواصل البحثي
        </h3>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            padding: "1.5rem",
            borderRadius: "1rem",
            border: "1px solid rgba(251, 191, 36, 0.2)",
            textAlign: "right",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.8",
          }}
        >
          <p style={{ color: "#d1d5db", fontSize: "0.95rem" }}>
            إلى فريق Builder المحترم،
            <br />
            <br />
            أود التقدم بطلب تخصيص بيئة تنفيذ محلية لمنصة تحرير الصور المعتمدة
            على الذكاء الاصطناعي{" "}
            <strong style={{ color: "#00ffff" }}>Knoux-VERSA</strong>.<br />
            <br />
            🔹 تعتمد المنصة على معمارية معيارية تعتمد نماذج SD وMODNet.
            <br />
            🔹 واجهة تعتمد الزجاجية التفاعلية مستوحاة من هوية الزمالك البصرية.
            <br />
            🔹 دعم كامل للتنفيذ المحلي بدون أي تبعية خارجية.
            <br />
            🔹 التكامل مع واجهة Gradio للمعاينة اللحظية.
            <br />
            🔹 التحكم بالأوامر عبر النص أو الإدخال المرئي.
            <br />
            <br />
            يرجى تزويدي بتفاصيل حول تكامل المنصة مع Builder.io ودعم الإضافات
            الخاصة.
            <br />
            <br />
            تحياتي،
            <br />
            <strong style={{ color: "#fbbf24" }}>
              knoux 🇦🇪 — جهاز knoux7-core
            </strong>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "3rem", color: "#9ca3af" }}>
        <p style={{ fontSize: "1.1rem" }}>
          تم التطوير بإبداع بواسطة{" "}
          <span style={{ color: "#00ffff", fontWeight: "bold" }}>
            Sadek Elgazar
          </span>{" "}
          | © 2025 KNOUX VERSA
        </p>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Advanced AI-Powered Image Processing Research Platform
        </p>
      </div>
    </div>
  );
}
