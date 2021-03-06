# IssueTracker

Prosta aplikacja pozwalająca na dodawanie, wyświetlanie oraz edycję statusu zgłoszenia.

1. Architektura

- Backend oparty została o platformę NodeJS wraz z językiem TypeScript.
- Dane zapisywane są do bazy MongoDB przy użyciu pakietu Mongoose.
- Front-end napisany został w JavaScripcie z użyciem WebComponents.

Uwagi: W normalnych warunkach produkcyjnych planując aplikację skalowalną i łatwą w utrzymaniu,
front-end powinien opierać się o framework typu React bądź Angular.
Ze względu na małe rozmiary aplikacji zdecydowałem się jednak nie używać żadnego frameworka.
Najprostrzym sposobem na wykonanie tego zadania byłoby użycie silnika szablonów
i renderowanie wszystkiego po stronie serwera jednak takie rozwiązanie za bardzo przypomina mi czasy gdy pracowałem z PHP
czyli czasy do których nie chciałbym wracać :). Finalnie zdecydowałem się wybrać rozwiązanie pośrednie i przy okazji sprawdzić
czy problematyczne jest tworzenie aplikacji SPA przy wykorzystaniu natywnych WebComponentów. Jako, że symuluję tutaj działanie 
frameworka to z serwera przesyłany jest tylko prosty widok. Wszystkie inne operację wykonywane są już dynamicznie na wzór SPA.


2. Działanie

Zaimplementowałem minimalny wariant zadania wraz z dodatkową funkcją dodawania zgłoszeń.
Po uruchomieniu aplikacji poprzez "npm run start" a następnie wejśćiu na "http://localhost:3000" automatycznie zostanie
zaczytana z bazy danych lista testowo dodanych zgłoszeń. Aby dodać nowe zgłoszenie należy użyć przycisku "+"
w prawym dolnym rogu. Aby zmienić status zgłoszenia należy kliknąć na etykietę pokazującą aktualny status zgłoszenia.

3. Usprawnienia

- kod powinien być zbundlowany i zminifikowany
- można by się zastanowić nad backendową walidacją statusów zgłoszeń (Aktualnie interfejs graficzny wymusza ustawienie
prawidłowego statusu)
- napewno należałoby escapować inputy aby uodpornić się na ataki typu XSS
- należałoby się zastanowić nad możliwymi podatnościami na ataki i ustawić odpowiednie polityki typu CORS
- adresy url po stronie frontendowej nie powinny być hardcoded, config nie powinien być w repo
- brakuje testów api oraz testów jednostkowych (supertest, jest)
