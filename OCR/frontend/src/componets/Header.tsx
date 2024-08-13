import { Button, Header, Icon } from "@trussworks/react-uswds"

export const UploadHeader = () => {
    return (
        <Header style={{ height: '50px', padding: '8px' }}>
        <div className="display-flex height-full flex-align-center" style={{ justifyContent: 'space-between' }}>
            <div className="display-flex flex-jusitfy-start height-full flex-align-center" style={{ justifyContent: 'space-between' }}>
                <Button data-testid='close-button' unstyled type="button" style={{ paddingRight: '8px' }}>
                    <Icon.Close size={3} color="black" />
                </Button>
                <h1>Annotate new template</h1>
            </div>
            <div className="display-flex flex-jusitfy-start height-full flex-align-center">
                <Button type="reset" outline style={{ height: '40px', boxShadow: 'inset 0 0 0 2px  #adadad', color: '#adadad'}} >Back</Button>
                <Button type="submit" base style={{ height: '40px' }}>Submit</Button>
            </div>
        </div>
    </Header>
    )
}

