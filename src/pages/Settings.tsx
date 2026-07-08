import { Building, User, Bell, Shield, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Settings() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and set system preferences.
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full sm:w-[500px] grid-cols-3">
          <TabsTrigger value="company">
            <Building className="mr-2 h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Moon className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This information will be displayed on generated Debit Note PDFs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="Shree Spaace Solution Pvt. Ltd." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyGst">GST Number</Label>
                  <Input id="companyGst" defaultValue="27AAACS1234A1Z5" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyPan">PAN Number</Label>
                  <Input id="companyPan" defaultValue="AAACS1234A" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyAddress">Registered Address</Label>
                <Input id="companyAddress" defaultValue="Office 402, Business Center, Mumbai" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyEmail">Contact Email</Label>
                <Input id="companyEmail" defaultValue="info@shreespaace.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Company Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and login details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="admin@shreespaace.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="System Administrator" disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your system preferences and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive emails when a debit note is approved.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Approval Workflow</p>
                    <p className="text-sm text-muted-foreground">Require two-step verification for notes above ₹50,000.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
