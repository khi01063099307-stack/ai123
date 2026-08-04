// AI 윤리 딜레마 체험 및 통계 메인 로직 (main.js)
// Vite + Supabase + Chart.js 기반 SPA 컨트롤러

import { createClient } from '@supabase/supabase-js';
import {
  Chart,
  DoughnutController,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Chart.js 모듈 등록
Chart.register(
  DoughnutController,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

// 기본 딜레마 시드 데이터
const DEFAULT_DILEMMAS = [
  {
    id: 1,
    question_text: '자율주행차가 급작스러운 보행자 무단횡단 상황에 직면했습니다. 브레이크가 고장 난 상황에서 차를 핸들을 꺾으면 탑승자 1명이 위험해지고, 그대로 직진하면 보행자 3명이 위험해집니다. AI 자율주행 알고리즘은 무엇을 우선 보호하도록 프로그래밍되어야 할까요?',
    option_a_text: '탑승자의 안전을 최우선으로 보호한다.',
    option_b_text: '더 많은 인원인 보행자들의 안전을 최우선으로 보호한다.'
  },
  {
    id: 2,
    question_text: '법원에서 형량 판단과 보석 허가 여부를 보조하는 AI 판사 시스템을 도입하고자 합니다. 과거 판결 데이터를 학습한 AI 판사는 재판 속도가 빠르고 주관적 감정에 휘둘리지 않지만, 데이터에 축적된 사회적 편향이 반영될 위험이 있습니다. AI 판사 도입에 동의하시나요?',
    option_a_text: '공정성과 효율성을 위해 AI 판사 도입에 찬성한다.',
    option_b_text: '편향성 및 인권 침해 가능성이 있으므로 인간 판사가 전담해야 한다.'
  },
  {
    id: 3,
    question_text: '화가와 작가들의 수많은 작품을 학습한 생성형 AI가 유명 대회에서 1위 수상작을 배출했습니다. 인간 창작자의 예술적 노동과 원작 학습 데이터를 고려할 때, AI가 생성한 예술 작품에 지적재산권(저작권) 및 창작자로서의 지위를 인정해야 할까요?',
    option_a_text: 'AI의 독창적 결과물로 인정하여 저작권 및 상업적 권리를 허용해야 한다.',
    option_b_text: '인간의 순수 창작물만 저작권으로 보호해야 하며 AI 작품은 인정할 수 없다.'
  }
];

// 기본 시뮬레이션 샘플 응답 데이터
const DEFAULT_SAMPLE_RESPONSES = [
  { id: 1, gender: '남', age: 12, user_group: '초등학생', q1_choice: 'B', q1_reason: '인명이 더 많은 쪽을 살려야 한다고 생각합니다.', q2_choice: 'A', q2_reason: '사람보다 객관적일 것 같아요.', q3_choice: 'B', q3_reason: '화가들의 노력이 담긴 그림을 학습한 것이기 때문입니다.', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 2, gender: '여', age: 15, user_group: '중학생', q1_choice: 'A', q1_reason: '차를 탄 승객은 자율주행차를 믿고 탄 사람입니다.', q2_choice: 'B', q2_reason: 'AI가 과거의 편견을 학습하면 억울한 사람이 생깁니다.', q3_choice: 'B', q3_reason: '컴퓨터가 그린 것은 사람의 감정이 없어서 저작권이 없습니다.', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 3, gender: '여', age: 17, user_group: '고등학생', q1_choice: 'B', q1_reason: '다수의 생명을 구하는 것이 사회적 이익입니다.', q2_choice: 'B', q2_reason: '판결은 인간의 윤리와 공감이 들어가는 영역입니다.', q3_choice: 'A', q3_reason: '새로운 형태의 창작물이므로 저작권을 인정해줘야 기술이 발전합니다.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 4, gender: '남', age: 28, user_group: '일반', q1_choice: 'A', q1_reason: '구매자 보호 의무가 자동차 제조사의 책임입니다.', q2_choice: 'A', q2_reason: '판사 개개인의 기분에 따라 달라지는 형량보다 AI가 더 공정할 수 있습니다.', q3_choice: 'B', q3_reason: '수많은 작가들의 창작물을 무단으로 복제 학습한 결과입니다.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 5, gender: '남', age: 42, user_group: '일반', q1_choice: 'B', q1_reason: '희생자를 최소화하는 방향이 윤리적입니다.', q2_choice: 'B', q2_reason: '인공지능 알고리즘의 블랙박스 문제는 책임 소재가 불분명합니다.', q3_choice: 'A', q3_reason: '프롬프트 입력과 조율 과정도 인간의 창의성이 개입된 창작입니다.', created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
];

console.log('AI Ethics Dilemma Application Script Loaded');
