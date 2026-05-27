import { Fragment, memo } from "react";
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

export const Panel = memo(function Panel({
  bookcase,
  booksByGenre,
  side,
  segIndex,
  onOpenSub,
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
          side={side}
          onOpenSub={onOpenSub}
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
});
