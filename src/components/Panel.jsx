import { Fragment } from "react";
import { useGenres } from "../context/GenreContext";
import Bookcase from "./Bookcase";
import {
  SEG,
  HALF_W,
  PANEL_H,
  SIGN_W,
  SIGN_H,
  SIGN_ABOVE,
  SIGN_Z_BIAS,
} from "../constants/corridor";
import { DUMMY_SPINES } from "../utils/bookUtils";

// ── 가짜 책장 패널 ──
export function DummyPanel({ side, segIndex }) {
  const z = -(segIndex * SEG + SEG / 2);
  const x = side === "left" ? -HALF_W : HALF_W;
  const rotY = side === "left" ? 90 : -90;

  return (
    <div
      className='panel'
      style={{
        width: SEG,
        height: PANEL_H,
        marginLeft: -SEG / 2,
        marginTop: -PANEL_H / 2,
        transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg)`,
      }}>
      <div className='bookcase'>
        <div className='bc-back' />
        <div className='bc-side bc-side-l' />
        <div className='bc-side bc-side-r' />
        <div className='bc-side bc-side-t' />
        <div className='bc-side bc-side-b' />
        <div className='bc-shelves'>
          {[...Array(4)].map((_, r) => {
            const offset = (segIndex * 3 + r * 7) % DUMMY_SPINES.length;
            const spines = [
              ...DUMMY_SPINES.slice(offset),
              ...DUMMY_SPINES.slice(0, offset),
            ];

            return (
              <div key={r} className='bc-row'>
                <div className='bc-space'>
                  <div className='bc-books'>
                    {spines.map((s, i) => (
                      <div
                        key={`${s.key}-${i}`}
                        className='bc-spine'
                        style={{
                          width: s.w,
                          height: s.h,
                          background: s.bg,
                          opacity: 0.85,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className='bc-plank' />
              </div>
            );
          })}
        </div>
        <div className='bc-frame' />
      </div>
    </div>
  );
}

// ── 실제 책장 패널 ──
export function Panel({
  bookcase,
  booksByGenre,
  side,
  segIndex,
  onOpenSub,
  setActiveTip,
}) {
  const { themeFor } = useGenres();
  if (!bookcase) return null;
  const z = -(segIndex * SEG + SEG / 2);

  const x = side === "left" ? -HALF_W : HALF_W;
  const rotY = side === "left" ? 90 : -90;
  const t = themeFor(bookcase.top.code);
  const signLabel =
    bookcase.partCount > 1
      ? `${t.label} ${bookcase.part + 1}/${bookcase.partCount}`
      : t.label;

  const yOffset = -(PANEL_H / 2) - SIGN_H / 2 - SIGN_ABOVE;
  const zOffset = z + SIGN_Z_BIAS;

  return (
    <Fragment>
      <div
        className='panel'
        style={{
          width: SEG,
          height: PANEL_H,
          marginLeft: -SEG / 2,
          marginTop: -PANEL_H / 2,
          transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg)`,
        }}>
        <Bookcase
          bookcase={bookcase}
          booksByGenre={booksByGenre}
          onOpenSub={onOpenSub}
          setActiveTip={setActiveTip}
        />
      </div>

      <div
        className='shelf-sign'
        style={{
          width: SIGN_W,
          height: SIGN_H,
          marginLeft: -SIGN_W / 2,
          marginTop: -SIGN_H / 2,
          "--sign-x": `${x}px`,
          "--sign-y": `${yOffset}px`,
          "--sign-z": `${zOffset}px`,
        }}>
        <span className='sign-label' style={{ color: t.color }}>
          {signLabel}
        </span>
        <span className='sign-code'>{bookcase.top.code}</span>
      </div>
    </Fragment>
  );
}
