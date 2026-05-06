export function Footer() {
  return (
    <footer className="bg-[#112e51] text-[#7a90b8] py-4 px-5 text-xs text-center">
      <div className="max-w-[620px] mx-auto">
        <p className="mb-2">&copy; 2026 MyCollegePensionEdu.com — All Rights Reserved</p>
        <div className="flex justify-center gap-5 mb-3">
          <a href="/privacy" className="text-[#aabbd4] hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="text-[#aabbd4] hover:underline">
            Terms of Use
          </a>
        </div>
        <p className="text-[#aabbd4] leading-relaxed">
          <strong className="text-[#dce4ef]">Notice:</strong> All licensed representatives are not
          employed by or affiliated with any college, university, state pension program, or higher
          education organization. Information provided during this appointment is for educational purposes only
          and does not constitute financial or legal advice.
        </p>
      </div>
    </footer>
  )
}
