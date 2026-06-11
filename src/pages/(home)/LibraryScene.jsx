import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CorridorView from "./CorridorView";
import ShelfView from "./ShelfView";

// CorridorView는 한 번만 마운트하고 ShelfView를 위에 겹친다 (재진입 시 트리 재구축 회피)
export default function LibraryScene() {
  const [activeGenre, setActiveGenre] = useState(null);

  return (
    <div className='library-scene'>
      <CorridorView onOpenShelf={setActiveGenre} hidden={!!activeGenre} />
      <AnimatePresence>
        {activeGenre && (
          <ShelfView
            key={activeGenre.code}
            genre={activeGenre}
            onBack={() => setActiveGenre(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
