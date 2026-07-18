export type AstrologyService = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
};

export const astrologyServices: AstrologyService[] = [
  {
    id: "kundali-analysis",
    title: "జాతక విశ్లేషణ",
    subtitle: "Kundali Analysis",
    description:
      "జనన వివరాల ఆధారంగా లగ్నం, రాశి, నక్షత్రం, గ్రహ స్థానాలు మరియు దశలను పరిశీలించే జ్యోతిష్య విశ్లేషణ.",
    points: ["లగ్నం", "రాశి", "నక్షత్రం", "గ్రహ స్థానాలు"],
  },
  {
    id: "marriage-matching",
    title: "వివాహ జాతక సరిపోలిక",
    subtitle: "Marriage Matching",
    description:
      "వివాహానికి ముందు జాతక సరిపోలిక, గుణమేళనం, దోష విశ్లేషణ మరియు అనుకూలత పరిశీలన.",
    points: ["గుణమేళనం", "మంగళ దోషం", "అనుకూలత", "జాతక సరిపోలిక"],
  },
  {
    id: "mangal-dosha",
    title: "మంగళ దోష విశ్లేషణ",
    subtitle: "Mangal Dosha Analysis",
    description:
      "జాతకంలో మంగళుడి స్థానం ఆధారంగా మంగళ దోషం, తీవ్రత మరియు ప్రభావాన్ని పరిశీలించడం.",
    points: ["మంగళ స్థానం", "దోష తీవ్రత", "వివాహ ప్రభావం", "సూచనలు"],
  },
  {
    id: "dasha-guidance",
    title: "దశా భుక్తి మార్గదర్శనం",
    subtitle: "Dasha Guidance",
    description:
      "ప్రస్తుత మహాదశ, రాబోయే దశలు మరియు జీవన దశల ఆధారంగా జ్యోతిష్య మార్గదర్శనం.",
    points: ["మహాదశ", "అంతర్దశ", "ప్రస్తుత దశ", "రాబోయే కాలం"],
  },
];