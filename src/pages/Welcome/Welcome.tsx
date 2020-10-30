import {
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRouterLink,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import Swiper, { SwiperOptions } from "swiper";
import { useHash } from "../../helpers/use-hash";
import "./Welcome.css";

const parseHash = (h: string | number) => +h || 0;

const SLIDES = {
  WELCOME_FIRST_SLIDE: 0,
  WELCOME_LAST_SLIDE: 0,
};

const SLIDES_COUNT = Object.keys(SLIDES).length;

export interface WelcomeProps extends RouteComponentProps {}

const Welcome: React.FC<WelcomeProps> = ({ ...props }) => {
  const { location, match } = props;
  const [hash, setHash] = useHash((location as unknown) as Location);
  if (hash.trim().length === 0) {
    setHash(0);
  }
  const [currentSlide, setCurentSlide] = React.useState(parseHash(hash || 0));
  const [queueCurrentSlide, setQueueCurentSlide] = React.useState(currentSlide);
  const [slidesCount, setSlidesCount] = React.useState(SLIDES_COUNT);
  const [showFinishButton, setShowFinishButton] = React.useState(
    currentSlide === slidesCount - 1,
  );
  const [swiper, setSwiper] = React.useState<Swiper>();
  const queue = (index: number) => {
    const validIndex = Math.min(
      Math.max(index, 0),
      (swiper?.slides.length ?? slidesCount) - 1,
    );
    queueCurrentSlide !== validIndex && setQueueCurentSlide(validIndex);
  };
  useEffect(() => {
    (() => {
      if (currentSlide !== queueCurrentSlide) {
        setCurentSlide(queueCurrentSlide);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueCurrentSlide]);
  useEffect(() => {
    (() => {
      if (swiper) {
        if (currentSlide !== swiper.activeIndex) {
          swiper.slideTo(currentSlide);
          setHash(currentSlide);
        }
      }
      swiper && setShowFinishButton(currentSlide === slidesCount - 1);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, slidesCount]);
  useEffect(() => {
    (() => {
      if (hash.trim().length === 0) {
        setHash(0);
      } else if (parseHash(hash) !== currentSlide) {
        queue(parseHash(hash));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);
  useEffect(() => {
    (() => {
      if (hash.trim().length === 0) {
        setHash(0);
      }
      queue(parseHash(hash));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    (() => {
      if (swiper) {
        setSlidesCount(swiper.slides.length);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiper]);
  const goToSlide = (index: number) => swiper && queue(index);
  const prev = () => goToSlide(currentSlide - 1);
  const next = () => goToSlide(currentSlide + 1);
  const WelcomeFirstSlide = () => (
    <div>
      <IonGrid className="ion-padding welcome-slide">
        <h1>Bem-Vindo ao Booxperience!</h1>
        <p>Uma rede social aberta para amantes de livros.</p>
      </IonGrid>
    </div>
  );
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bem-Vindo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: 1 }}>
            <IonSlides
              options={
                {
                  initialSlide: currentSlide,
                  on: {
                    beforeInit(this: Swiper) {
                      setSwiper(this);
                    },
                  },
                } as SwiperOptions
              }
              style={{ height: "100%" }}
              onIonSlideDidChange={() => {
                swiper && setHash(swiper.activeIndex);
              }}
            >
              <IonSlide>
                <WelcomeFirstSlide />
              </IonSlide>
            </IonSlides>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <IonButton
                disabled={currentSlide === 0}
                fill="clear"
                onClick={() => {
                  prev();
                }}
                children={<>Anterior</>}
              />
            </div>
            <div>
              {showFinishButton ? (
                <IonButton
                  fill="solid"
                  color="primary"
                  children={<>Começar</>}
                />
              ) : (
                <IonButton
                  fill="clear"
                  onClick={() => {
                    next();
                  }}
                  children={<>Próximo</>}
                />
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
