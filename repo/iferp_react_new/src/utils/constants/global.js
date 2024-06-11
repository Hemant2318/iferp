export const limit = 10;

// export const mimeType = "video/mp4";
// export const fileName = "MyRecordedVideo.mp4";

export const paySuccess =
  "Congratulations, Your payment has been successfully processed. We confirm your purchase.";
export const payError =
  "Unfortunately, we couldn't process your payment. We regret the inconvenience. Kindly try again later, contact us for assistance.";

export const chatPath = "chat";
export const profilePath = "Profile";
export const BrochurePath = "Event/Brochure";
export const CoverImagePath = "Event/CoverImage";
export const posterPath = "Event/Poster";
export const conferencePath = "Event/Conference";
export const agendaPath = "Event/Agenda";
export const certificatePath = "Certificate";
export const chapterMemberPath = "ChapterMember";
export const journalsPath = "Journals";
export const journalsPaperPath = "Journals/Submitted-Papers";
export const journalAcceptanceLetterPath = "RegistrationAcceptanceLetter";
export const journalPlagiarismDocumentPath = "PlagiarismDocument";
export const publicationAssistancePath = "Event/PublicationAssistance";
export const eventAbstarctPath = "Event/Abstract";
export const eventAcceptanceLetterPath = "Event/RegistrationAcceptanceLetter";
export const careerPath = "Career";
export const networkPath = "Network";
export const eventPlagiarismDocumentPath = "Event/PlagiarismDocument";
export const reportPath = "Report";
export const figuresPath = "Figures";
export const speakerUploadedFile = "speakerattachment";
export const welcomeVideo = "DocumentVideo";
export const welcomeMessage = "DocumentImage";
export const speakerPost = "speakerPost";
export const commonFile = "commonFile";
export const advertisement = "Advertisement";

export const awardTypeOptions = [
  {
    value: "Best Paper Award",
  },
  {
    value: "Best Paper Presentation Award",
  },
  {
    value: "Women Excellence Award",
  },
  {
    value: "Young Researchers Award",
  },
  {
    value: "Career Contribution Award",
  },
  {
    value: "Student Contribution Award",
  },
  {
    value: "Outstanding Chapter Award",
  },
  {
    value: "IFERP Fellowship",
  },
  {
    value: "IFERP Distinguished Member Award",
  },
  {
    value: "IFERP Senior Member Award",
  },
  {
    value: "Outstanding Contribution to IFERP Award",
  },
  {
    value: "Ashok Jain Awards of Academic",
  },
  {
    value: "Research & Higher Education",
  },
  {
    value: "Smt. Sneha Lata Dash Awards for Scientific Excellence",
  },
];

export const memberType = [
  { value: "Chairperson" },
  {
    value: "Co - Chairperson",
  },
  {
    value: "General Secretary",
  },
  {
    value: "Executive Member (Membership Management)",
  },
  {
    value: "Executive Member (Guest Lecture & FDP)",
  },
  {
    value: "Executive Member (Chapter Activities)",
  },
  {
    value: "Executive Member (Newsletter - Treasurer)",
  },
  {
    value: "Executive Member (Women Centric Activities)",
  },
  {
    value: "Secretary",
  },
  {
    value: "Professional Ambassador",
  },
  {
    value: "Student Ambassador",
  },
  {
    value: "Advisory Board Members",
  },
  {
    value: "Executive Committee Member (Scientific Conferences & Events)",
  },
];

export const eventMode = [
  { value: "Physical" },
  {
    value: "Virtual",
  },
  {
    value: "Hybrid",
  },
];

export const virtualPlatform = [
  { value: "Zoom" },
  {
    value: "Google Meet",
  },
];
export const eventType = [
  { value: "Event" },
  {
    value: "Conference",
  },
];
export const journalType = [
  { url: "scopus-indexed-journals", value: "SCOPUS Indexed Journals" },
  {
    url: "web-of-science-journals",
    value: "Web of Science Journals",
  },
  {
    url: "ugc-journals",
    value: "UGC Journals",
  },
  {
    url: "google-scholar-journals",
    value: "Google Scholar Journals",
  },
];
export const asistanceType = [
  {
    id: "Artwork & Formatting - $ 80",
    value: "Artwork & Formatting",
    amount: 80,
  },
  {
    id: "Journal Selection - $ 100",
    value: "Journal Selection",
    amount: 100,
  },
  {
    id: "Editing - $ 90",
    value: "Editing",
    amount: 90,
  },
  {
    id: "Journal Submission - $ 120",
    value: "Journal Submission",
    amount: 120,
  },
  {
    id: "Plagiarism Check - $ 89",
    value: "Plagiarism Check",
    amount: 89,
  },
];
export const statusType = [
  { id: "0", label: "Pending" },
  { id: "1", label: "Accepted" },
  { id: "2", label: "Rejected" },
];
export const membershipType = [
  {
    id: "0",
    title: "Admin",
    description: "",
    type: "admin",
  },
  {
    id: "2",
    title: "Professional Member",
    description: "Academicians, Researchers, Corporate individuals",
    type: "professional",
  },
  {
    id: "3",
    title: "Institutional Member",
    description: "Universities/Colleges/Institutions",
    type: "institutional",
  },
  {
    id: "4",
    title: "Corporate Member",
    description: "Corporates/Organizations",
    type: "corporate",
  },
  {
    id: "5",
    title: "Student Member",
    description: "UG, PG Students",
    type: "student",
  },
  {
    id: "6",
    title: "Resource Member",
    description: "UG, PG Students",
    type: "resource",
  },
];
export const monthNames = [
  { label: "January", id: "01" },
  { label: "February", id: "02" },
  { label: "March", id: "03" },
  { label: "April", id: "04" },
  { label: "May", id: "05" },
  { label: "June", id: "06" },
  { label: "July", id: "07" },
  { label: "August", id: "08" },
  { label: "September", id: "09" },
  { label: "October", id: "10" },
  { label: "November", id: "11" },
  { label: "December", id: "12" },
];
export const resourceType = [
  {
    id: "1",
    label: "Membership",
  },
  {
    id: "2",
    label: "Conference Co-ordinator",
  },
];

export const researchType = [
  { id: "Researcher ID", label: "Researcher ID" },
  { id: "Vidwan-ID", label: "Vidwan-ID" },
  { id: "Orcid - ID", label: "Orcid - ID" },
  { id: "Scopus Author ID", label: "Scopus Author ID" },
  { id: "Google Scholar", label: "Google Scholar" },
  { id: "Publons ID", label: "Publons ID" },
  {
    id: "Linked-in-Profile",
    label: "Linked-in-Profile",
  },
];

export const postAs = [
  {
    id: "2",
    label:
      "Both as public and private (everyone can access, also save the post as private where you can access later)",
  },
  {
    id: "0",
    label: "Only as public post (Everyone can access and read)",
  },
  {
    id: "1",
    label:
      "Only as private file (Save private file as backup where only can access)",
  },
];

export const certificateField = [
  {
    id: "user_name",
    label: "Name (First name and Last Name)",
    exText: "John Doe",
    // exText: "Chetandra Pratap Singh Chauhan",
  },
  {
    id: "first_name",
    label: "First Name",
    exText: "John",
  },
  {
    id: "last_name",
    label: "Last Name",
    exText: "Doe",
  },
  {
    id: "start_date",
    label: "From Date",
    exText: "21-07-2023",
  },
  {
    id: "expire_date",
    label: "To Date",
    exText: "15-10-2023",
  },
  {
    id: "date_of_issue",
    label: "Date Of Issue",
    exText: "10-12-2023",
  },
  {
    id: "nationality",
    label: "Nationality",
    exText: "India",
  },
  {
    id: "membership_id",
    label: "Membership ID",
    exText: "PROF-0707",
  },
  {
    id: "member_type",
    label: "Member Type",
    exText: "Proffetional",
  },
  {
    id: "institution_or_company",
    label: "Institution Name Or Company Name",
    exText: "Aditya College of Engineering",
  },
  {
    id: "cert_no",
    label: "Certificate Number",
    exText: "IFERP2023_2307_ICRAT_202354",
  },
  {
    id: "paper_title",
    label: "Paper Name",
    exText:
      "International Conference on Digital Transformation A strategic approach towards Sustainable Development - (ICDTSD-2022)",
  },
];

export const speechCategory = [
  { value: "Session Speaker", id: "0" },
  { value: "Keynote Speaker", id: "1" },
];
export const eventName = [{ value: "demo event" }, { value: "testing event" }];

export const menteesStatus = [
  { value: "Upcoming - Accepted", id: { status: 0, is_approve: 1 } },
  { value: "Upcoming - Pending", id: { status: 0, is_approve: 0 } },
  { value: "Completed", id: { status: 1, is_approve: "" } },
];

export const myseduleStatus = [
  { value: "Upcoming - Accepted", id: { status: 0, is_approve: 1 } },
  { value: "Upcoming - Pending", id: { status: 0, is_approve: 0 } },
  { value: "Completed", id: { status: 1, is_approve: "" } },
  { value: "Rejected", id: { status: 0, is_approve: 2 } },
  { value: "Show All", id: { status: "", is_approve: "" } },
];

export const paymentStatus = [
  { id: "1", label: "Completed" },
  { id: "2", label: "Refunded" },
];

export const searchOptions = [
  { value: "Mentor Name", id: "mentor_name" },
  { value: "Session Name", id: "session_name" },
];

export const timeDurations = [
  { label: "30 Mins", id: "30", unit: "M" },
  { label: "60 Mins", id: "1", unit: "H" },
];

export const startTimeList = [
  { value: "01:00 AM", id: "01:00" },
  { value: "02:00 AM", id: "02:00" },
  { value: "03:00 AM", id: "03:00" },
  { value: "04:00 AM", id: "04:00" },
  { value: "05:00 AM", id: "05:00" },
  { value: "06:00 AM", id: "06:00" },
  { value: "07:00 AM", id: "07:00" },
  { value: "08:00 AM", id: "08:00" },
  { value: "09:00 AM", id: "09:00" },
  { value: "10:00 AM", id: "10:00" },
  { value: "11:00 AM", id: "11:00" },
  { value: "12:00 PM", id: "12:00" },
  { value: "13:00 PM", id: "13:00" },
  { value: "14:00 PM", id: "14:00" },
  { value: "15:00 PM", id: "15:00" },
  { value: "16:00 PM", id: "16:00" },
  { value: "17:00 PM", id: "17:00" },
  { value: "18:00 PM", id: "18:00" },
  { value: "19:00 PM", id: "19:00" },
  { value: "20:00 PM", id: "20:00" },
  { value: "21:00 PM", id: "21:00" },
  { value: "22:00 PM", id: "22:00" },
  { value: "23:00 PM", id: "23:00" },
  { value: "00:00 AM", id: "00:00" },
];
export const endTimeList = [
  { value: "01:00 AM", id: "01:00" },
  { value: "02:00 AM", id: "02:00" },
  { value: "03:00 AM", id: "03:00" },
  { value: "04:00 AM", id: "04:00" },
  { value: "05:00 AM", id: "05:00" },
  { value: "06:00 AM", id: "06:00" },
  { value: "07:00 AM", id: "07:00" },
  { value: "08:00 AM", id: "08:00" },
  { value: "09:00 AM", id: "09:00" },
  { value: "10:00 AM", id: "10:00" },
  { value: "11:00 AM", id: "11:00" },
  { value: "12:00 PM", id: "12:00" },
  { value: "13:00 PM", id: "13:00" },
  { value: "14:00 PM", id: "14:00" },
  { value: "15:00 PM", id: "15:00" },
  { value: "16:00 PM", id: "16:00" },
  { value: "17:00 PM", id: "17:00" },
  { value: "18:00 PM", id: "18:00" },
  { value: "19:00 PM", id: "19:00" },
  { value: "20:00 PM", id: "20:00" },
  { value: "21:00 PM", id: "21:00" },
  { value: "22:00 PM", id: "22:00" },
  { value: "23:00 PM", id: "23:00" },
  { value: "00:00 AM", id: "00:00" },
];

export const bankAccountType = [
  { value: "Savings", id: "saving" },
  { value: "Current", id: "current" },
];

export const userAlertPaymentMessage =
  "IFERP doesn’t share your bank account details with anyone ";
