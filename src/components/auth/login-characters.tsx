"use client";

/**
 * Painel de personagens animados (inspirado no modelo escolhido):
 * as pupilas acompanham o que se digita no e-mail e os olhos "fecham"
 * quando o campo de senha está em foco — ninguém espia a senha.
 */

function Eyes({
  look,
  closed,
  size = 16,
  gap = 16,
  pupil = 7,
}: {
  look: number; // -1..1 (horizontal)
  closed: boolean;
  size?: number;
  gap?: number;
  pupil?: number;
}) {
  const tx = look * (size / 2 - pupil / 2 - 1);
  return (
    <div className="flex items-center" style={{ gap }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-full bg-white"
          style={{
            width: size,
            height: closed ? 3 : size,
            transition: "height .28s ease",
          }}
        >
          {!closed ? (
            <div
              className="rounded-full bg-neutral-900"
              style={{
                width: pupil,
                height: pupil,
                transform: `translateX(${tx}px)`,
                transition: "transform .18s ease",
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function LoginCharacters({
  emailLength,
  passwordFocused,
}: {
  emailLength: number;
  passwordFocused: boolean;
}) {
  // pupilas vão da esquerda (0) para a direita conforme digita o e-mail
  const look = Math.min(emailLength, 18) / 18; // 0..1
  const lr = -1 + look * 2; // -1..1

  return (
    <div className="relative h-72 w-full max-w-md" aria-hidden>
      {/* personagem verde (alto) */}
      <div
        className="absolute left-[18%] bottom-0 h-60 w-32 rounded-t-[3.5rem] transition-transform duration-500"
        style={{
          background: "var(--char-green)",
          transform: passwordFocused ? "rotate(-7deg)" : "rotate(0deg)",
          transformOrigin: "bottom center",
        }}
      >
        <div className="absolute left-1/2 top-9 -translate-x-1/2">
          <Eyes look={lr} closed={passwordFocused} />
        </div>
      </div>

      {/* personagem carvão (estreito) */}
      <div
        className="absolute left-[42%] bottom-0 h-48 w-24 rounded-t-[3rem] transition-transform duration-500"
        style={{ background: "var(--char-dark)" }}
      >
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          <Eyes look={lr} closed={passwordFocused} size={13} gap={12} pupil={6} />
        </div>
      </div>

      {/* personagem laranja (domo grande) */}
      <div
        className="absolute left-0 bottom-0 h-44 w-52 rounded-t-full"
        style={{ background: "var(--char-orange)" }}
      >
        <div className="absolute left-1/2 top-16 -translate-x-1/2">
          <Eyes look={lr} closed={passwordFocused} size={14} gap={28} pupil={6} />
        </div>
      </div>

      {/* personagem amarelo (domo com boca) */}
      <div
        className="absolute right-0 bottom-0 h-52 w-40 rounded-t-full"
        style={{ background: "var(--char-yellow)" }}
      >
        <div className="absolute left-1/2 top-12 -translate-x-1/2 flex flex-col items-center gap-3">
          <Eyes look={lr} closed={passwordFocused} size={13} gap={26} pupil={6} />
          <div className="h-0.5 w-8 rounded-full bg-neutral-900/80" />
        </div>
      </div>
    </div>
  );
}
