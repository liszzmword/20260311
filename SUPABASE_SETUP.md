# Supabase로 로또 추첨 번호 저장하기

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 접속 후 로그인
2. **New project** → Organization 선택, 프로젝트 이름 입력(예: `lotto`), 비밀번호 설정 후 생성

---

## 2. 테이블 만들기

Supabase 대시보드에서 **SQL Editor** → **New query** 후 아래 SQL 실행:

```sql
-- 로또 추첨 결과 저장 테이블
create table if not exists public.lotto_draws (
  id uuid default gen_random_uuid() primary key,
  numbers smallint[] not null,   -- 본 번호 6개 [10, 15, 19, 27, 30, 33]
  bonus smallint not null,       -- 보너스 번호
  created_at timestamptz default now()
);

-- 익명 사용자도 insert 허용 (웹에서 바로 저장하려면)
alter table public.lotto_draws enable row level security (RLS);

create policy "Allow anonymous insert"
  on public.lotto_draws for insert
  to anon
  with check (true);

-- 읽기는 필요 시 허용
create policy "Allow anonymous select"
  on public.lotto_draws for select
  to anon
  using (true);
```

**Run** 실행 후 테이블이 생성됩니다.

---

## 3. API 키 복사하기

1. 왼쪽 메뉴 **Project Settings** (톱니바퀴) → **API**
2. **Project URL** 복사
3. **Project API keys** 중 **anon public** 키 복사

---

## 4. Vercel 환경 변수 설정 (배포 시)

이 프로젝트는 Vercel 환경 변수로 Supabase를 설정합니다. **index.html을 수정할 필요 없습니다.**

1. [Vercel 대시보드](https://vercel.com/dashboard) → 해당 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 아래 두 개 추가:

| Name | Value |
|------|--------|
| `SUPABASE_URL` | Supabase Project URL (예: `https://xxxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Supabase anon public 키 |

4. **Save** 후 재배포(또는 다음 배포 시 자동 반영)

동작 방식: 브라우저가 `/api/config`를 호출하면, Vercel 서버리스 함수가 위 환경 변수를 읽어 JSON으로 내려줍니다. 클라이언트는 그 값을 사용해 Supabase에 저장합니다.

---

## 5. 로컬에서 테스트할 때

로컬에서는 환경 변수가 없으므로 Supabase 저장이 되지 않습니다. Vercel에 배포한 뒤 사용하거나, 로컬에 `.env`를 두고 Vercel CLI(`vercel dev`)로 실행하면 됩니다.

---

## 6. 저장 데이터 확인

Supabase 대시보드 **Table Editor** → **lotto_draws** 테이블에서  
`numbers`, `bonus`, `created_at` 컬럼으로 저장된 내역을 확인할 수 있습니다.

---

## 보안 참고

- **anon** 키는 프론트엔드에 노출되어도 됩니다. 실제 접근 제어는 RLS 정책으로 합니다.
- insert만 허용하고 select를 막고 싶다면, 위 SQL에서 `"Allow anonymous select"` 정책을 만들지 않거나 삭제하면 됩니다.
