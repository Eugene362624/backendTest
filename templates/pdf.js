const pdf = ({firstName, lastName, image}) => {
    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>app work result</title>
                <style>
                    * { 
                    margin: 0;
                    }
                    header {
                        background-color: gray;
                        border-radius: .5rem;
                    }
                    main {
                        background-color: gray;
                        border-radius: 1rem;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h3>App Work Result</h3>
                </header>
                <main>
                    <table>
                        <tr>
                            <td>
                                <h2>Name:</h2> <h3>${firstName}</h3>
                            <td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Surname:</h2> <h3>${lastName}</h3>
                            <td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Image:</h2> <h3>${image}</h3>
                            <td>
                        </tr>                       
                    </table>
                </main>
            </body>
    `
}

module.exports = pdf