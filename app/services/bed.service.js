import { BehaviorSubject } from "rxjs";

const bedSubject = new BehaviorSubject(null);

export const bedService = {
    onChange,
    setBed,   
    bed: bedSubject.asObservable(),
    get bedValue() {
      return bedSubject.value;
    },
  };

  function setBed(bed) {
    if (bed != null) bedSubject.next(bed);
  }

  // enable subscribing to alerts observable
function onChange() {
    return bedSubject
      .asObservable()
      .pipe();
  }