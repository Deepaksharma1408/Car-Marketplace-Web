import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Globe, ShieldCheck } from 'lucide-react';

export default function ArabicTermsPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans" dir="rtl">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full text-xs text-muted leading-relaxed space-y-8 text-right">
        <div className="border-b border-border pb-6 flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 border border-accent/30 text-accent uppercase tracking-wider">
              الامتثال القانوني الإماراتي
            </span>
            <h1 className="font-heading text-3xl font-bold text-text mt-2">
              الشروط والأحكام العامة للمنصة
            </h1>
            <p className="text-xs text-muted mt-1">
              آخر تحديث: أكتوبر ٢٠٢٦ • القانون الواجب التطبيق: دبي، الإمارات العربية المتحدة (مركز دبي المالي العالمي DIFC)
            </p>
          </div>

          <Link
            href="/terms"
            className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-accent font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            dir="ltr"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>English Version</span>
          </Link>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">١. نطاق عمل المنصة (المرحلة الأولى - دبي)</h2>
          <p>
            تعمل فيكل سبوت (Vehicle Spot) كمنصة تقنية وتطبيق رقمي يرتكز على مقاطع الفيديو الإعلانية القصيرة لعرض وترويج المركبات والسيارات الفاخرة الموجودة داخل إمارة دبي بدولة الإمارات العربية المتحدة. المنصة لا تعتبر وكالة سيارات أو وسيطاً تجارياً مباشراً أو محفظة ضمان مالي.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٢. المصداقية وسلامة المحتوى المرئي</h2>
          <p>
            يجب أن تعكس جميع مقاطع الفيديو والصور الفوتوغرافية الحالة الواقعية للسيارة المعروضة بدقة تامة. يُحظر تماماً التعديل الرقمي المضلل أو الفلاتر التوليدية التي تغير حالة الطلاء أو قراءة العداد أو الهيكل. الإعلانات المنشورة تحت <strong>المسار ج (الصور الفوتوغرافية فقط)</strong> تظل صوراً ثابتة ولن يتم تحويلها إلى فيديو تلقائياً دون إذن مسبق وصريح من البائع.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٣. اشتراطات توثيق وكلاء وتجار السيارات</h2>
          <p>
            يتعين على معارض ووكلاء السيارات المسجلين تقديم رخصة تجارية سارية صادرة عن دائرة الاقتصاد والسياحة في دبي (DED). تحتفظ إدارة أوتوريل بالحق في تعليق أو إلغاء شارة "وكيل معتمد" في حال انتهاء صلاحية الرخصة التجارية وعدم تجديدها.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٤. التواصل المباشر مع المشترين</h2>
          <p>
            تتيح أوتوريل التواصل الفوري والمباشر مع البائع عبر تطبيق واتساب (WhatsApp) والمكالمات الهاتفية المباشرة دون فرض أي عمولات أو رسوم وساطة خلال المرحلة التشغيلية الأولى. يتحمل الأطراف المسؤولية الكاملة لإجراء الفحص الفني المعتمد لدى هيئة الطرق والمواصلات (RTA) قبل إتمام أي معاملة مالية.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">٥. الاختصاص القضائي وفض النزاعات</h2>
          <p>
            تخضع هذه الشروط وتفسر وفقاً للقوانين والأنظمة المعمول بها في مركز دبي المالي العالمي (DIFC) والقوانين الاتحادية لدولة الإمارات العربية المتحدة.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
