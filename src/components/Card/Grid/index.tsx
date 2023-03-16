import './styles.css'
import { Card, CardProps } from "..";
import { useRef, useState } from 'react';
import { duplicateRegenerateSortArray } from '../../../utils/card-utils';

export interface GridProps {
    cards: CardProps[];
}

export function Grid({ cards }: GridProps) {
    const [stateCards, setStateCards] = useState(() => {
        return duplicateRegenerateSortArray(cards);
    });
    const first = useRef<CardProps | null>(null);
    const second = useRef<CardProps | null>(null);
    const unflip = useRef(false);
    const [matches, setMatches] = useState(0);
    const [moves, setMoves] = useState(0);

    const handleReset = () => {
        setStateCards(duplicateRegenerateSortArray(cards));
        first.current = null;
        second.current = null;   
        unflip.current = false;
        setMatches(0);
        setMoves(0);
    }

    const handleClick = (id: string) => {
        const newStateCards = stateCards.map((card) => {
            // Se o id do cartão não for o id clicado, não executará nada;
            if (card.id != id) return card;
            // Se o cartão já estiver virado, não executará nada;
            if (card.flipped) return card;

            // Desvirando possíveis cartas erradas
            if (unflip.current && first.current && second.current) {
                first.current.flipped = false;
                second.current.flipped = false;
                first.current = null;
                second.current = null;   
                unflip.current = false;
            }

            // Virando o card
            card.flipped = true;

            // Configurando o primeiro e o segundo cartão clicado
            if (first.current === null) {
                first.current = card;
            }else if (second.current === null) {
                second.current = card;
            }

            // Checando se os dois cartões clicados estão corretos
            if (first.current && second.current) {
                if (first.current.back === second.current.back) {
                    // Player acertou
                    first.current = null;
                    second.current = null;
                    setMatches((m) => m + 1);
                }else {
                    // Player errou
                    unflip.current = true;
                }

                setMoves((m) => m + 1);
            }

            return card;
        });

        setStateCards(newStateCards);
    }

    return (
        <>
        <div className="container">
            <div className="text">
                <h1>Jogo de Memória TS</h1>
            </div>
            <p>Movimentos: {moves} | Acertos: {matches} <button onClick={() => handleReset()}>Reiniciar</button></p>
            <div className="grid">
            {stateCards.map((card) => {
                return <Card {...card} key={card.id} handleClick = {handleClick}/>;
            })}
            </div>
        </div>
        </>
    )
};