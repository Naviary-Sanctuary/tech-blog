import type { Locale } from "../constants";

type HomeMessage = {
  description: string;
  heroTitle1: string;
  heroTitleAccent: string;
  heroTitle2: string;
  heroBody1: string;
  heroBody2: string;
  heroBody3: string;
  heroBody4: string;
  readMore: string;
  brandCtaEyebrow: string;
  brandCtaLabel: string;
  brandCtaCaption: string;
};

type ArticleMessage = {
  title: string;
  description: string;
};

type PostMessage = {
  backToList: string;
  prevPost: string;
  nextPost: string;
};
type OpenSourceMessage = {
  title: string;
  description: string;
};

type Messages = {
  home: HomeMessage;
  articles: ArticleMessage;
  post: PostMessage;
  openSource: OpenSourceMessage;
};

export const messages: Record<Locale, Messages> = {
  ko: {
    home: {
      description: "나비어리의 기술은 기록에서 시작됩니다.",
      heroTitle1: "나비어리의 기술은",
      heroTitleAccent: "기록",
      heroTitle2: "에서 시작됩니다.",
      heroBody1: "기록은 좌표가 되고, 좌표는 방향이 됩니다.",
      heroBody2: "우리는 개체와 번식의 흐름을 구조화하고,",
      heroBody3: "브리딩을 설계 가능한 시스템으로 전환합니다.",
      heroBody4: "이곳은 그 과정을 기록하는 기술 아카이브입니다.",
      readMore: "더보기",
      brandCtaEyebrow: "브랜드 바로가기",
      brandCtaLabel: "Naviary 브랜드 페이지",
      brandCtaCaption: "브랜드 메인에서 서비스 비전을 확인해 보세요.",
    },
    articles: {
      title: "Articles",
      description: "나비어리의 기술은 기록에서 시작됩니다.",
    },
    post: {
      backToList: "목록으로",
      prevPost: "이전 게시글",
      nextPost: "다음 게시글",
    },
    openSource: {
      title: "Open Source",
      description: "Build, use, and share.",
    },
  },
  en: {
    home: {
      description: "Naviary's technology begins with records.",
      heroTitle1: "Naviary's technology begins with ",
      heroTitleAccent: "records",
      heroTitle2: ".",
      heroBody1: "Records become coordinates, and coordinates set the direction.",
      heroBody2: "We structure the flow of individuals and breeding,",
      heroBody3: "transforming breeding into an engineered system.",
      heroBody4: "This is a technical archive documenting our journey.",
      readMore: "Read More",
      brandCtaEyebrow: "Brand Hub",
      brandCtaLabel: "Visit Naviary Brand",
      brandCtaCaption: "Explore the main brand site and product vision.",
    },
    articles: {
      title: "Articles",
      description: "Naviary's technology begins with records.",
    },
    post: {
      backToList: "Back to List",
      prevPost: "Previous Article",
      nextPost: "Next Article",
    },
    openSource: {
      title: "Open Source",
      description: "Build, use, and share.",
    },
  },
};

export const getMessages = (locale: string) =>
  messages[locale as Locale];
