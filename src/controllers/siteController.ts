class siteController {
    public static index(req: any, res: any, next: any) {
        // return
        const user = req.session.user
        if (user) {
            res.render('index', { user: user })
            return
        }
        res.render('index')
    }

}
export default siteController
