class checkMiddlerWares {
    public static checkLogin(req: any, res: any, next: any) {
        if (req.isAuthenticated()) {
            next()
        } else {
            res.redirect('/login')
        }

    }
    public static checkLoginJson(req: any, res: any, next: any) {
        if (req.isAuthenticated()) {
            next()
        } else {
            res.json({ url: '/login' })
        }

    }
    public static checkIsAdmin(req: any, res: any, next: any) {
        const user = req.session.user
        if (req.isAuthenticated() && user.isadmin == 1) {
            next()
        }
        else {
            res.redirect('/')
        }
    }
}
export default checkMiddlerWares
