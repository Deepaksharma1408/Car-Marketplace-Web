import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Globe, ShieldCheck } from 'lucide-react';

export default function ArabicPrivacyPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans" dir="rtl">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full text-xs text-muted leading-relaxed space-y-8 text-right">
        <div className="border-b border-border pb-6 flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-2/15 border border-accent-2/30 text-accent-2 uppercase tracking-wider">
              المرسوم بقانون اتحادي رقم ٤٥ لسنة ٢٠٢١
            </span>
            <h1 className="font-heading text-3xl font-bold text-text mt-2">
              سياسة الخصوصية وحماية البيانات الشخصية
            </h1>
            <p className="text-xs text-muted mt-1">
              تاريخ السريان: أكتوبر ٢٠٢٦ • متوافق مع قانون حماية البيانات الشخصية الإماراتي (PDPL)
            </p>
          </div>

          <Link
            href="/privacy"
            className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-accent font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            dir="ltr"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>English Version</span>
          </Link>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">١. مبادئ معالجة البيانات</h2>
          <p>
            تلتزم منصة أوتوريل بمعالجة البيانات الشخصية بنزاهة وشفافية وفقاً لأحكام المرسوم بقانون اتحادي رقم ٤٥ لسنة ٢٠٢١ بشأن حماية البيانات الشخصية في دولة الإمارات العربية المتحدة. نقوم بجمع البيانات الأساسية اللازمة لتمكين المشاهدة عالية الدقة لمقاطع الفيديو وتسهيل وصول طلبات المشترين المباشرة إلى البائعين.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٢. الفصل التام بين الإحصاءات العامة وبيانات البائع الخاصة</h2>
          <p>
            حرصاً على سرية الأعمال التجارية للبائعين والمعارض، يتم الفصل التام بين العدادات العامة (عدد المشاهدات، الإعجابات، التعليقات) وبين مؤشرات الأداء الخاصة بالبائع (نقرات التواصل عبر واتساب، الاتصالات الهاتفية، متوسط مدة المشاهدة، ومعدل إكمال الفيديو). لا يطلع على هذه الإحصاءات سوى البائع صاحب الإعلان وفريق الإشراف الإداري المعتمد.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٣. حق نقل البيانات وحذف الحساب</h2>
          <p>
            يتمتع المستخدم بالحق الكامل في طلب تنزيل نسخة رقمية من كافة بياناته وحركاته المسجلة، بالإضافة إلى الحق في حذف الحساب. عند تقديم طلب حذف الحساب من لوحة التحكم، يتم فوراً إيقاف ظهور جميع الإعلانات في السوق العام، مع الاحتفاظ بالسجلات المشفرة لمدة ٣٠ يوماً كفترة سماح تنظيمية لمنع الاحتيال التجاري قبل الحذف النهائي الشامل.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٤. التواصل مع مسؤول حماية البيانات</h2>
          <p>
            لأي استفسارات قانونية أو ممارسة حقوقك المتعلقة ببياناتك، يُرجى التواصل مع فريق الامتثال عبر البريد الإلكتروني: <strong>privacy@vehiclespot.ae</strong> أو زيارة مقرنا في برج السعادة، مركز دبي المالي العالمي، دبي، الإمارات العربية المتحدة.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
